import { Component, OnInit, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
declare var $: any;
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
import { supabase } from 'src/app/supabaseClient';
import { ConvertService } from "src/app/core/services/convert/convert.service";
import { lastValueFrom } from "rxjs";


@Component({
    selector: 'app-setting-page',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})


export class SettingPage implements OnInit {
    empresaForm!: FormGroup;
    guardadoExitoso = false;
    errorGuardado: string | null = null;
    certificadoSeleccionado = false;
    certificado: File | null = null;
    certificadoUrl: string | null = null;
    empresaID = localStorage.getItem('empresaId');
    empresaIdFirebase: string | null = null;

    constructor(
        private fb: FormBuilder,
        private firestore: Firestore,
        private convertService: ConvertService
    ) {
    }






    ngOnInit(): void {
        this.buildForm();
        this.obtenerDatosEmpresa();
    }

    buildForm() {
        this.empresaForm = this.fb.group({
            id: [''],
            rnc: ['', Validators.required],
            nombreEmpresa: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', Validators.required],
            direccion: ['',],
            contrasenaCertificado: ['', Validators.required]
        });
    }

    onFileChange(event: any) {
        const files: FileList = event.target.files;
        if (files.length > 0) {
            this.certificado = files[0];
            this.certificadoSeleccionado = true;
        } else {
            this.certificado = null;
            this.certificadoSeleccionado = false;
        }
    }

    async guardarConfiguracion() {
        if (this.empresaForm.valid && this.certificado) {
            this.guardadoExitoso = false;
            this.errorGuardado = null;

            try {
                console.log('✅ Validación correcta, comenzando conversión...');

                // 1️⃣ Enviar el certificado al backend para convertirlo
                const res = await lastValueFrom(
                    this.convertService.convertCert(this.certificado, this.empresaForm.get('contrasenaCertificado')?.value)
                );
                console.log('🔗 Certificado convertido:', res);

                if (res.status !== 'success') {
                    throw new Error('Error al convertir el certificado: ' + res.message);
                }

                // 2️⃣ Convertir base64 a Blob
                const convertedBlob = new Blob([
                    Uint8Array.from(atob(res.data.base64), c => c.charCodeAt(0))
                ], { type: 'application/x-pkcs12' });

                const path = `certificados/${this.empresaForm.get('rnc')!.value}_${this.certificado.name}`;
                console.log('📂 Subiendo archivo convertido a Supabase:', path);

                const { data, error } = await supabase
                    .storage
                    .from('uploads')
                    .upload(path, convertedBlob, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: 'application/x-pkcs12'
                    });

                if (error) {
                    throw new Error('Error al subir a Supabase: ' + error.message);
                }

                const certificadoUrl = `https://mruomgdwtutfwqxffgaj.supabase.co/storage/v1/object/public/uploads/${path}`;
                console.log('🔗 Certificado disponible en:', certificadoUrl);

                // 3️⃣ Guardar datos en Firestore
                const id = this.empresaForm.get('id')?.value;
                const docRef = doc(this.firestore, 'configuracionEmpresa', id);

                await updateDoc(docRef, {
                    rnc: this.empresaForm.get('rnc')?.value,
                    nombreEmpresa: this.empresaForm.get('nombreEmpresa')?.value,
                    email: this.empresaForm.get('email')?.value,
                    telefono: this.empresaForm.get('telefono')?.value,
                    direccion: this.empresaForm.get('direccion')?.value,
                    certificadoUrl: certificadoUrl,
                    contrasenaCertificado: this.empresaForm.get('contrasenaCertificado')?.value,
                    fechaGuardado: new Date()
                });

                this.guardadoExitoso = true;
                this.empresaForm.reset();
                this.certificado = null;
                this.certificadoSeleccionado = false;
            } catch (error: any) {
                console.error('❌ Falló el proceso:', error);
                this.errorGuardado = error.message;
            }
        } else {
            this.errorGuardado = 'Por favor, complete el formulario y seleccione el certificado.';
        }
    }


    cleanData() {
        this.empresaForm.reset();
        this.certificadoSeleccionado = false;
        this.certificado = null;
        this.buildForm();
    }

    obtenerDatosEmpresa() {
        const coleccionRef = collection(this.firestore, 'configuracionEmpresa');
        const q = query(coleccionRef, where('rnc', '==', this.empresaID));

        collectionData(q, { idField: 'id' }).subscribe((data) => {
            this.empresaForm.patchValue(data[0]);
            this.empresaForm.disable();
            this.certificadoUrl = data[0]["certificadoUrl"];
            if (this.certificadoUrl === '') {
                this.empresaForm.get('contrasenaCertificado')?.enable();
            }
            this.empresaIdFirebase = data[0]["id"];

        });
    }

    generarTxtEmpresa(): void {
        if (!this.empresaForm || !this.certificadoUrl) {
            console.warn('Datos incompletos para generar el archivo');
            return;
        }

        const datos = this.empresaForm.getRawValue(); // Incluye todos los campos, aunque el form esté deshabilitado
        const contenidoTxt = [];

        contenidoTxt.push("=== DATOS DE EMPRESA ===");

        for (const key in datos) {
            if (Object.prototype.hasOwnProperty.call(datos, key)) {
                contenidoTxt.push(`${key}: ${datos[key]}`);
            }
        }

        contenidoTxt.push("\n=== URL CERTIFICADO SUPABASE ===");
        contenidoTxt.push(this.certificadoUrl || 'No disponible');

        const blob = new Blob([contenidoTxt.join('\n')], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `empresa_${this.empresaID}.txt`;
        link.click();
    }







}

