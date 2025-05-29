import { Component, OnInit, } from "@angular/core";
declare var $: any;
import * as XLSX from 'xlsx';
import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    query,
    where,
    doc,
    updateDoc
} from '@angular/fire/firestore';
import { DgiiService } from "src/app/core/services/dgii/dgii.service";
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cert-page',
    templateUrl: './cert.page.html',
    styleUrls: ['./cert.page.scss'],
})


export class CertPage implements OnInit {
    xmlContent: string = '';
    showXmlModal: boolean = false;
    empresaID = localStorage.getItem('empresaId');

    isLoading: boolean = false;
    isLoadingSend: boolean = false;
    camposDeseados: string[] = [
        'CasoPrueba',
        'TipoeCF',
        'ENCF',
        'MontoTotal',
        'RNCEmisor',
        'RNCComprador'
    ];
    excelFile: File | null = null;
    tipoSeleccionado: string = '0';
    estadoSeleccionado: string = 'Todos';
    textoBusqueda: string = '';

    dataOriginal: any[] = [];
    excelData: any[] = [];
    TIPOS_COMPROBANTES = [
        { id: "31", name: "Factura de Crédito Fiscal" },
        { id: "32", name: "Factura de Consumo" },
        { id: "33", name: "Nota de Débito" },
        { id: "34", name: "Nota de Crédito" },
        { id: "41", name: "Comprobante de Compras" },
        { id: "43", name: "Comprobante de Gastos Menores" },
        { id: "44", name: "Comprobante de Regímenes Especiales" },
        { id: "45", name: "Comprobante Gubernamental" },
        { id: "46", name: "Comprobante para Pagos al Exterior" },
        { id: "47", name: "Comprobante de Ingresos" },
    ]

    constructor(private firestore: Firestore, private dgiiService: DgiiService) { }


    onFileChange(event: any): void {
        const file = event.target.files[0];
        this.excelFile = file || null;
    }

    ngOnInit(): void {
        this.obtenerDesdeFirebase();
    }

    sentToDgii(datos: any) {
        this.isLoadingSend = true;
        const payload = { scenarios: [datos] }; // 👈 Envolver en { scenarios: [ datos ] }

        console.log('Datos a enviar a DGII:', payload);

        this.dgiiService.sentToDgii(payload).subscribe(async (response) => {
            console.log('✅ Respuesta de DGII:', response);
            this.isLoadingSend = false;

            if (response.status === 'success' && response.data?.results?.length > 0) {
                const updates = response.data.results.map((result: any) => {
                    const { scenario } = result;

                    const rfceData = result.responseRFCE?.dgiiResponse;
                    const rfceXmlUrl = result.responseRFCE?.xmlPublicUrl;

                    const xmlPublicUrl = result.responseXML?.xmlPublicUrl;
                    const xmlResponseData = result.responseXML?.dgiiResponse; // puede no existir

                    const trackId = rfceData?.trackId || xmlResponseData?.trackId;

                    console.log(trackId);

                    const dataToUpdate: any = {
                        xmlPublicUrl: rfceXmlUrl || xmlPublicUrl,
                        trackId: trackId ?? '',
                    };

                    // Establecer estatus según el origen
                    if (rfceData?.estado) {
                        dataToUpdate.estatus = rfceData.estado === 'Aceptado' ? 'Enviado' : 'Rechazado';
                    } else if (xmlResponseData?.trackId && !xmlResponseData?.error) {
                        dataToUpdate.estatus = 'Enviado';
                    } else {
                        dataToUpdate.estatus = 'Firmado';
                    }

                    const documentId = scenario.id;

                    if (documentId) {
                        const docRef = doc(this.firestore, 'encfFacturas', documentId);
                        updateDoc(docRef, dataToUpdate);

                        // Solo si hay trackId llamamos a getStatusByTrackID
                        if (trackId) {
                            return this.getStatusByTrackID(trackId, documentId);
                        } else {
                            return Promise.resolve();
                        }
                    } else {
                        console.warn('⚠️ No se encontró ID para el documento.');
                        return Promise.resolve();
                    }
                });




                try {
                    await Promise.all(updates);
                    this.isLoadingSend = false;
                    console.log('✅ Todos los documentos actualizados en Firebase');
                } catch (error) {
                    this.isLoadingSend = false;
                    console.error('❌ Error actualizando documentos en Firebase:', error);
                }
            } else {
                this.isLoadingSend = false;
                console.error('❌ Error en respuesta de DGII o no hay resultados');
                alert('❌ Error en respuesta de DGII o no hay resultados');
            }
        }, (error) => {
            this.isLoadingSend = false;
            console.error('❌ Error al enviar a DGII:', error);
            alert(`❌ Error al enviar a DGII: ${error}`);
        });
    }

    verXmlPublicUrl(xmlPublicUrl: string): void {
        console.log('URL del XML público:', xmlPublicUrl);
        this.dgiiService.getXmlContent(xmlPublicUrl).subscribe({
            next: (xml: string) => {
                const formatted = this.formatXml(xml);
                this.xmlContent = this.highlightXml(formatted);
                this.showXmlModal = true;
            },
            error: (error) => {
                console.error('❌ Error cargando XML:', error);
            }
        });

    }

    formatXml(xml: string): string {
        const PADDING = ' '.repeat(2); // 2 espacios para indentación
        const reg = /(>)(<)(\/*)/g;
        let formatted = '';
        let pad = 0;

        xml = xml.replace(reg, '$1\r\n$2$3');
        xml.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad !== 0) pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            formatted += PADDING.repeat(pad) + node + '\r\n';
            pad += indent;
        });

        return formatted.trim();
    }


    getStatusByTrackID(trackId: string, firebaseId: string): void {
        this.dgiiService.getStatusByTrackID(trackId, this.empresaID!).subscribe({
            next: (response) => {
                console.log('Respuesta completa de DGII:', response);

                if (response.status === 'success' && response.data?.dgiiResponse) {
                    const dgiiResponse = response.data.dgiiResponse;
                    const nuevoEstado = dgiiResponse.estado; // Aprobado o Rechazado

                    console.log('📋 Estado:', nuevoEstado);

                    // 🔥 1️⃣ Actualizar el estatus en Firebase
                    this.actualizarEstatusEnFirebase(firebaseId, nuevoEstado);

                    // 🔥 2️⃣ Mostrar alerta
                    // alert(`Estado actualizado: ${nuevoEstado}`);
                    Swal.fire({
                        icon: nuevoEstado === 'Rechazado' ? 'error' : 'success',
                        title: nuevoEstado,
                        text: dgiiResponse.mensajes[0].valor,
                    });

                } else {
                    console.error('❌ No se encontró información en la respuesta');
                }
            },
            error: (error) => {
                console.error('❌ Error al consultar estado en DGII:', error);
            }
        });
    }

    actualizarEstatusEnFirebase(firebaseId: string, nuevoEstado: string): void {
        const documentoRef = doc(this.firestore, 'DataFromExcel', firebaseId); // 👈 Ajusta 'TuColeccion'

        updateDoc(documentoRef, {
            estatus: nuevoEstado
        }).then(() => {
            console.log('✅ Estatus actualizado en Firebase:', nuevoEstado);
        }).catch((error) => {
            console.error('❌ Error actualizando estatus en Firebase:', error);
        });
    }


    async procesarArchivo(): Promise<void> {
        this.isLoading = true;
        $('#exampleModal').modal('hide');

        if (!this.excelFile) {
            alert('Primero selecciona un archivo Excel');
            this.isLoading = false;
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e: any) => {
            const bstr: string = e.target.result;
            const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            const sheetName: string = workbook.SheetNames[0];
            const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

            // ⚡ Leer datos como texto para no perder formato
            const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
                raw: false,
                defval: '',
            });

            const coleccionRef = collection(this.firestore, 'DataFromExcel');

            for (const fila of rawData) {
                const filaObj: Record<string, any> = {};

                for (const key in fila) {
                    if (Object.prototype.hasOwnProperty.call(fila, key)) {
                        const value = fila[key];

                        if (typeof value === 'string' && value.startsWith('#')) {
                            // Si el valor empieza con '#', lo omitimos
                            continue;
                        }

                        // ⚡ Guardar exactamente el valor como viene del Excel
                        filaObj[key] = value;
                    }
                }

                // ⚡ Insertar fila a Firebase Firestore
                await addDoc(coleccionRef, {
                    ...filaObj,
                    estatus: 'Pendiente',
                    xmlPublicUrl: '',
                    trackId: '',
                    pdf: '',
                    EmpresaID: this.empresaID
                });
            }

            this.obtenerDesdeFirebase(); // Actualizar la vista
            this.isLoading = false;
        };

        reader.onerror = (error) => {
            console.error('Error al leer el archivo Excel:', error);
            this.isLoading = false;
        };

        reader.readAsBinaryString(this.excelFile);
    }


    obtenerDesdeFirebase(): void {
        const coleccionRef = collection(this.firestore, 'DataFromExcel');
        const q = query(coleccionRef, where('EmpresaID', '==', this.empresaID));

        collectionData(q, { idField: 'id' }).subscribe((data) => {
            const ordenTipoeCF = ['31', '32', '41', '43', '44', '45', '46', '47', '33', '34'];

            // Ordenar usando la posición en el array ordenTipoeCF
            data.sort((a, b) => {
                return (
                    ordenTipoeCF.indexOf(a["TipoeCF"]?.toString()) -
                    ordenTipoeCF.indexOf(b["TipoeCF"]?.toString())
                );
            });

            this.dataOriginal = data;
            this.excelData = data;
            this.isLoading = false;
            this.aplicarFiltros();
        });
    }

    aplicarFiltros(): void {
        let dataFiltrada = [...this.dataOriginal];

        // Filtro por tipo de comprobante
        if (this.tipoSeleccionado !== '0') {
            dataFiltrada = dataFiltrada.filter(item => item.TipoeCF == this.tipoSeleccionado);
        }

        // Filtro por estado
        if (this.estadoSeleccionado !== 'Todos') {
            dataFiltrada = dataFiltrada.filter(item => item.estatus === this.estadoSeleccionado);
        }

        // Filtro por texto libre
        if (this.textoBusqueda.trim() !== '') {
            const searchTerm = this.textoBusqueda.trim().toLowerCase();

            dataFiltrada = dataFiltrada.filter(item =>
                (item.ENCF && item.ENCF.toLowerCase().includes(searchTerm))
            );
        }

        this.excelData = dataFiltrada;
    }

    highlightXml(xml: string): string {
        return hljs.highlight(xml, { language: 'xml' }).value;
    }

}

