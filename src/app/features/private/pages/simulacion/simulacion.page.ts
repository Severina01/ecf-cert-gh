import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  where,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { EncfSimpleService } from 'src/app/core/services/encf/encf.service';
import { FirmaService } from 'src/app/core/services/firma/firma.service';
declare var $: any;
import { DgiiService } from 'src/app/core/services/dgii/dgii.service';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);
import Swal from 'sweetalert2';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-simulacion-page',
  templateUrl: './simulacion.page.html',
  styleUrls: ['./simulacion.page.scss'],
})
export class SimulacionPage implements OnInit {
  empresaID = '';
  isLoading = true;
  selectedFile: File | null = null;
  resumenTipos: Record<string, number> = {};
  jsonData: any[] = [];
  comprobantesAgrupados: Record<string, any[]> = {};
  comprobantes32Mayor: any[] = [];
  comprobantes32Menor: any[] = [];
  isLoadingSend = false;
  loadingReset = false;
  xmlContent: string = '';
  showXmlModal: boolean = false;

  //Factura

  FechaEmision = '';
  FechaFirma = '';
  ENCF = '';
  MontoTotal = '';
  MontoExento = '';
  RNCEmisor = '';
  RNCComprador = '';
  RazonSocialEmisor = '';
  DireccionEmisor = '';
  RazonSocialComprador = '';
  DireccionComprador = '';
  CodigoSeguridad = '';
  qrUrl = '';
  productos: any[] = [];
  subTotal = '';
  itbis = '';
  empresaLogo = '';
  empresaNombre = '';
  empresaDireccion = '';
  tipoEcfVar = '';
  FechaVencimientoSecuencia = '';
  ncfModificado = '';
  encabezadoComprobante = '';
  nombreComercialEmisor = '';
  puntoEmision = '';
  FechaFirmaFormateada = '';

  constructor(
    private encfService: EncfSimpleService,
    private firestore: Firestore,
    private dgiiService: DgiiService
  ) {}

  ngOnInit(): void {
    this.empresaID = localStorage.getItem('empresaId')!;
    this.jsonData = [
      {
        Version: '1.0',
        TipoeCF: '33',
        ENCF: 'E330000000002',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '400000.00',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '02-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '11-11-2020',
        FechaOrdenCompra: '10-11-2020',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        'NumeroContenedor ': '8019289',
        NumeroReferencia: '1447',
        MontoExento: '400000.00',
        MontoTotal: '400000.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'LECHE',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '10000.00',
        'UnidadMedida[1]': '47',
        'PrecioUnitarioItem[1]': '40.00',
        'MontoItem[1]': '400000.00',
        NCFModificado: 'E320000000006',
        FechaNCFModificado: '01-04-2020',
        CodigoModificacion: '3',
      },
      {
        Version: '1.0',
        TipoeCF: '32',
        ENCF: 'E320000000040',
        IndicadorMontoGravado: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '413785.30',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        MontoGravadoTotal: '350765.00',
        MontoGravadoI1: '269805.00',
        MontoGravadoI2: '80190.00',
        MontoGravadoI3: '770.00',
        MontoExento: '1625.00',
        ITBIS1: '18',
        ITBIS2: '16',
        ITBIS3: '0',
        TotalITBIS: '61395.30',
        TotalITBIS1: '48564.90',
        TotalITBIS2: '12830.40',
        TotalITBIS3: '0.00',
        MontoTotal: '413785.30',
        MontoPeriodo: '413785.30',
        ValorPagar: '413785.30',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'NombreItem[1]': 'LAPICES',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '23.00',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '35.0000',
        'MontoItem[1]': '805.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '2',
        'NombreItem[2]': 'GALLETAS',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '547.00',
        'UnidadMedida[2]': '6',
        'PrecioUnitarioItem[2]': '145.0000',
        'MontoItem[2]': '79315.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '3',
        'NombreItem[3]': 'PAN',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '14.00',
        'UnidadMedida[3]': '31',
        'PrecioUnitarioItem[3]': '55.0000',
        'MontoItem[3]': '770.00',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '4',
        'NombreItem[4]': 'LECHE',
        'IndicadorBienoServicio[4]': '1',
        'CantidadItem[4]': '25.00',
        'UnidadMedida[4]': '47',
        'PrecioUnitarioItem[4]': '65.0000',
        'MontoItem[4]': '1625.00',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '2',
        'NombreItem[5]': 'SALSA',
        'IndicadorBienoServicio[5]': '1',
        'CantidadItem[5]': '35.00',
        'UnidadMedida[5]': '47',
        'PrecioUnitarioItem[5]': '25.0000',
        'MontoItem[5]': '875.00',
        'NumeroLinea[6]': '6',
        'IndicadorFacturacion[6]': '1',
        'NombreItem[6]': 'TV LG 57"',
        'IndicadorBienoServicio[6]': '1',
        'CantidadItem[6]': '2.00',
        'UnidadMedida[6]': '43',
        'PrecioUnitarioItem[6]': '57000.0000',
        'MontoItem[6]': '114000.00',
        'NumeroLinea[7]': '7',
        'IndicadorFacturacion[7]': '1',
        'NombreItem[7]': 'LAVADORA-SECADORA  WESTINGHOUSE',
        'IndicadorBienoServicio[7]': '1',
        'CantidadItem[7]': '1.00',
        'UnidadMedida[7]': '43',
        'PrecioUnitarioItem[7]': '75000.0000',
        'MontoItem[7]': '75000.00',
        'NumeroLinea[8]': '8',
        'IndicadorFacturacion[8]': '1',
        'NombreItem[8]': 'ESTUFA MABE',
        'IndicadorBienoServicio[8]': '1',
        'CantidadItem[8]': '1.00',
        'UnidadMedida[8]': '43',
        'PrecioUnitarioItem[8]': '45000.0000',
        'MontoItem[8]': '45000.00',
        'NumeroLinea[9]': '9',
        'IndicadorFacturacion[9]': '1',
        'NombreItem[9]': 'LAPICES',
        'IndicadorBienoServicio[9]': '1',
        'CantidadItem[9]': '1.00',
        'UnidadMedida[9]': '43',
        'PrecioUnitarioItem[9]': '35000.0000',
        'MontoItem[9]': '35000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '32',
        ENCF: 'E320000000041',
        IndicadorMontoGravado: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '413785.30',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        MontoGravadoTotal: '350765.00',
        MontoGravadoI1: '269805.00',
        MontoGravadoI2: '80190.00',
        MontoGravadoI3: '770.00',
        MontoExento: '1625.00',
        ITBIS1: '18',
        ITBIS2: '16',
        ITBIS3: '0',
        TotalITBIS: '61395.30',
        TotalITBIS1: '48564.90',
        TotalITBIS2: '12830.40',
        TotalITBIS3: '0.00',
        MontoTotal: '413785.30',
        MontoPeriodo: '413785.30',
        ValorPagar: '413785.30',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'NombreItem[1]': 'LAPICEROS',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '23.00',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '35.0000',
        'MontoItem[1]': '805.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '2',
        'NombreItem[2]': 'GALLETAS',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '547.00',
        'UnidadMedida[2]': '6',
        'PrecioUnitarioItem[2]': '145.0000',
        'MontoItem[2]': '79315.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '3',
        'NombreItem[3]': 'PAN',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '14.00',
        'UnidadMedida[3]': '31',
        'PrecioUnitarioItem[3]': '55.0000',
        'MontoItem[3]': '770.00',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '4',
        'NombreItem[4]': 'ACEITES',
        'IndicadorBienoServicio[4]': '1',
        'CantidadItem[4]': '25.00',
        'UnidadMedida[4]': '47',
        'PrecioUnitarioItem[4]': '65.0000',
        'MontoItem[4]': '1625.00',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '2',
        'NombreItem[5]': 'SALSA',
        'IndicadorBienoServicio[5]': '1',
        'CantidadItem[5]': '35.00',
        'UnidadMedida[5]': '47',
        'PrecioUnitarioItem[5]': '25.0000',
        'MontoItem[5]': '875.00',
        'NumeroLinea[6]': '6',
        'IndicadorFacturacion[6]': '1',
        'NombreItem[6]': 'TV LG 57"',
        'IndicadorBienoServicio[6]': '1',
        'CantidadItem[6]': '2.00',
        'UnidadMedida[6]': '43',
        'PrecioUnitarioItem[6]': '57000.0000',
        'MontoItem[6]': '114000.00',
        'NumeroLinea[7]': '7',
        'IndicadorFacturacion[7]': '1',
        'NombreItem[7]': 'LAVADORA-SECADORA  WESTINGHOUSE',
        'IndicadorBienoServicio[7]': '1',
        'CantidadItem[7]': '1.00',
        'UnidadMedida[7]': '43',
        'PrecioUnitarioItem[7]': '75000.0000',
        'MontoItem[7]': '75000.00',
        'NumeroLinea[8]': '8',
        'IndicadorFacturacion[8]': '1',
        'NombreItem[8]': 'ESTUFA MABE',
        'IndicadorBienoServicio[8]': '1',
        'CantidadItem[8]': '1.00',
        'UnidadMedida[8]': '43',
        'PrecioUnitarioItem[8]': '45000.0000',
        'MontoItem[8]': '45000.00',
        'NumeroLinea[9]': '9',
        'IndicadorFacturacion[9]': '1',
        'NombreItem[9]': 'LAPICES',
        'IndicadorBienoServicio[9]': '1',
        'CantidadItem[9]': '1.00',
        'UnidadMedida[9]': '43',
        'PrecioUnitarioItem[9]': '35000.0000',
        'MontoItem[9]': '35000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '31',
        ENCF: 'E310000000020',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '50000.00',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789020',
        NumeroPedidoInterno: '123456789020',
        ZonaVenta: 'NORTE',
        FechaEmision: '02-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '11-11-2020',
        FechaOrdenCompra: '10-11-2020',
        NumeroOrdenCompra: '4500352242',
        CodigoInternoComprador: '10633440',
        'NumeroContenedor ': '8019293',
        NumeroReferencia: '1451',
        MontoExento: '50000.00',
        MontoTotal: '50000.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'PAMPERS',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '1000.00',
        'UnidadMedida[1]': '47',
        'PrecioUnitarioItem[1]': '50.00',
        'MontoItem[1]': '50000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '31',
        ENCF: 'E310000000021',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '50000.00',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789020',
        NumeroPedidoInterno: '123456789020',
        ZonaVenta: 'NORTE',
        FechaEmision: '02-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '11-11-2020',
        FechaOrdenCompra: '10-11-2020',
        NumeroOrdenCompra: '4500352242',
        CodigoInternoComprador: '10633440',
        'NumeroContenedor ': '8019293',
        NumeroReferencia: '1451',
        MontoExento: '50000.00',
        MontoTotal: '50000.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'PAMPERS',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '1000.00',
        'UnidadMedida[1]': '47',
        'PrecioUnitarioItem[1]': '50.00',
        'MontoItem[1]': '50000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '41',
        ENCF: 'E410000000007',
        FechaVencimientoSecuencia: '31-12-2025',
        IndicadorMontoGravado: '0',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '18955.58',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        FechaEmision: '01-04-2020',
        RNCComprador: '533445861',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 11',
        MontoGravadoTotal: '16064.05',
        MontoGravadoI1: '16064.05',
        ITBIS1: '18',
        TotalITBIS: '2891.53',
        TotalITBIS1: '2891.53',
        MontoTotal: '18955.58',
        TotalITBISRetenido: '2846.53',
        TotalISRRetencion: '1606.41',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'IndicadorAgenteRetencionoPercepcion[1]': '1',
        'MontoITBISRetenido[1]': '1040.90',
        'MontoISRRetenido[1]': '583.28',
        'NombreItem[1]': 'Servicio Profesional Legislativo',
        'IndicadorBienoServicio[1]': '2',
        'CantidadItem[1]': '15.00',
        'UnidadMedida[1]': '23',
        'PrecioUnitarioItem[1]': '385.0000',
        'RecargoMonto[1]': '57.75',
        'TipoSubRecargo[1][1]': '%',
        'SubRecargoPorcentaje[1][1]': '1.00',
        'MontosubRecargo[1][1]': '57.75',
        'MontoItem[1]': '5832.75',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '1',
        'IndicadorAgenteRetencionoPercepcion[2]': '1',
        'MontoITBISRetenido[2]': '490.95',
        'MontoISRRetenido[2]': '277.75',
        'NombreItem[2]': 'Asesoria Legal',
        'IndicadorBienoServicio[2]': '2',
        'CantidadItem[2]': '5.00',
        'UnidadMedida[2]': '43',
        'PrecioUnitarioItem[2]': '550.0000',
        'RecargoMonto[2]': '27.50',
        'TipoSubRecargo[2][1]': '%',
        'SubRecargoPorcentaje[2][1]': '1.00',
        'MontosubRecargo[2][1]': '27.50',
        'MontoItem[2]': '2777.50',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '1',
        'IndicadorAgenteRetencionoPercepcion[3]': '1',
        'MontoITBISRetenido[3]': '400.05',
        'MontoISRRetenido[3]': '227.25',
        'NombreItem[3]': 'Gestiones Legales',
        'IndicadorBienoServicio[3]': '2',
        'CantidadItem[3]': '9.00',
        'UnidadMedida[3]': '13',
        'PrecioUnitarioItem[3]': '250.0000',
        'RecargoMonto[3]': '22.50',
        'TipoSubRecargo[3][1]': '%',
        'SubRecargoPorcentaje[3][1]': '1.00',
        'MontosubRecargo[3][1]': '22.50',
        'MontoItem[3]': '2272.50',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '1',
        'IndicadorAgenteRetencionoPercepcion[4]': '1',
        'MontoITBISRetenido[4]': '764.56',
        'MontoISRRetenido[4]': '429.76',
        'NombreItem[4]': 'Legalizacion de documentos',
        'IndicadorBienoServicio[4]': '2',
        'CantidadItem[4]': '23.00',
        'UnidadMedida[4]': '15',
        'PrecioUnitarioItem[4]': '185.0000',
        'RecargoMonto[4]': '42.55',
        'TipoSubRecargo[4][1]': '%',
        'SubRecargoPorcentaje[4][1]': '1.00',
        'MontosubRecargo[4][1]': '42.55',
        'MontoItem[4]': '4297.55',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '1',
        'IndicadorAgenteRetencionoPercepcion[5]': '1',
        'MontoITBISRetenido[5]': '150.08',
        'MontoISRRetenido[5]': '88.38',
        'NombreItem[5]': 'Servicios ambulatorio',
        'IndicadorBienoServicio[5]': '2',
        'CantidadItem[5]': '7.00',
        'UnidadMedida[5]': '23',
        'PrecioUnitarioItem[5]': '125.0000',
        'RecargoMonto[5]': '8.75',
        'TipoSubRecargo[5][1]': '%',
        'SubRecargoPorcentaje[5][1]': '1.00',
        'MontosubRecargo[5][1]': '8.75',
        'MontoItem[5]': '883.75',
      },
      {
        Version: '1.0',
        TipoeCF: '44',
        ENCF: 'E440000000013',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '450000.00',
        'FormaPago[2]': '3',
        'MontoPago[2]': '467095.00',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        MontoExento: '917095.00',
        MontoTotal: '917095.00',
        MontoPeriodo: '917095.00',
        ValorPagar: '917095.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'GALLETAS GUARINA',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '25.00',
        'UnidadMedida[1]': '6',
        'PrecioUnitarioItem[1]': '90.0000',
        'MontoItem[1]': '2250.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '4',
        'NombreItem[2]': 'CAF¿ SANTO DOMINGO',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '50.00',
        'UnidadMedida[2]': '31',
        'PrecioUnitarioItem[2]': '200.0000',
        'MontoItem[2]': '10000.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '4',
        'NombreItem[3]': 'LECHE LA LECHERA',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '80.00',
        'UnidadMedida[3]': '47',
        'PrecioUnitarioItem[3]': '400.0000',
        'MontoItem[3]': '32000.00',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '4',
        'NombreItem[4]': 'PAPEL TOALLA',
        'IndicadorBienoServicio[4]': '1',
        'CantidadItem[4]': '100.00',
        'UnidadMedida[4]': '35',
        'PrecioUnitarioItem[4]': '350.0000',
        'MontoItem[4]': '35000.00',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '4',
        'NombreItem[5]': 'YOGURT GRIEGO',
        'IndicadorBienoServicio[5]': '1',
        'CantidadItem[5]': '125.00',
        'UnidadMedida[5]': '15',
        'PrecioUnitarioItem[5]': '100.0000',
        'MontoItem[5]': '12500.00',
        'NumeroLinea[6]': '6',
        'IndicadorFacturacion[6]': '4',
        'NombreItem[6]': 'POLLO CONGELADO',
        'IndicadorBienoServicio[6]': '1',
        'CantidadItem[6]': '200.00',
        'UnidadMedida[6]': '23',
        'PrecioUnitarioItem[6]': '175.0000',
        'MontoItem[6]': '35000.00',
        'NumeroLinea[7]': '7',
        'IndicadorFacturacion[7]': '4',
        'NombreItem[7]': 'SHAMPOO MI BELLEZA',
        'IndicadorBienoServicio[7]': '1',
        'CantidadItem[7]': '250.00',
        'UnidadMedida[7]': '15',
        'PrecioUnitarioItem[7]': '95.0000',
        'MontoItem[7]': '23750.00',
        'NumeroLinea[8]': '8',
        'IndicadorFacturacion[8]': '4',
        'NombreItem[8]': 'MANTEQUILLA LA MANICERA',
        'IndicadorBienoServicio[8]': '1',
        'CantidadItem[8]': '300.00',
        'UnidadMedida[8]': '47',
        'PrecioUnitarioItem[8]': '150.0000',
        'MontoItem[8]': '45000.00',
        'NumeroLinea[9]': '9',
        'IndicadorFacturacion[9]': '4',
        'NombreItem[9]': 'ARROZ CAMPOS',
        'IndicadorBienoServicio[9]': '1',
        'CantidadItem[9]': '325.00',
        'UnidadMedida[9]': '46',
        'PrecioUnitarioItem[9]': '1500.0000',
        'MontoItem[9]': '487500.00',
        'NumeroLinea[10]': '10',
        'IndicadorFacturacion[10]': '4',
        'NombreItem[10]': 'FRESAS DEL CAMPO',
        'IndicadorBienoServicio[10]': '1',
        'CantidadItem[10]': '315.00',
        'UnidadMedida[10]': '31',
        'PrecioUnitarioItem[10]': '115.0000',
        'MontoItem[10]': '36225.00',
        'NumeroLinea[11]': '11',
        'IndicadorFacturacion[11]': '4',
        'NombreItem[11]': 'ACEITE DE SOYA IMPERIAL',
        'IndicadorBienoServicio[11]': '1',
        'CantidadItem[11]': '215.00',
        'UnidadMedida[11]': '15',
        'PrecioUnitarioItem[11]': '700.0000',
        'MontoItem[11]': '150500.00',
        'NumeroLinea[12]': '12',
        'IndicadorFacturacion[12]': '4',
        'NombreItem[12]': 'HABICHUELAS BLANCAS',
        'IndicadorBienoServicio[12]': '1',
        'CantidadItem[12]': '145.00',
        'UnidadMedida[12]': '23',
        'PrecioUnitarioItem[12]': '80.0000',
        'MontoItem[12]': '11600.00',
        'NumeroLinea[13]': '13',
        'IndicadorFacturacion[13]': '4',
        'NombreItem[13]': 'JAB¿N LIQUIDO MAS COLOR',
        'IndicadorBienoServicio[13]': '1',
        'CantidadItem[13]': '85.00',
        'UnidadMedida[13]': '15',
        'PrecioUnitarioItem[13]': '70.0000',
        'MontoItem[13]': '5950.00',
        'NumeroLinea[14]': '14',
        'IndicadorFacturacion[14]': '4',
        'NombreItem[14]': 'AZ¿CAR EL BATEY',
        'IndicadorBienoServicio[14]': '1',
        'CantidadItem[14]': '90.00',
        'UnidadMedida[14]': '46',
        'PrecioUnitarioItem[14]': '100.0000',
        'MontoItem[14]': '9000.00',
        'NumeroLinea[15]': '15',
        'IndicadorFacturacion[15]': '4',
        'NombreItem[15]': 'SALAMI ESPECIAL INDUVECA',
        'IndicadorBienoServicio[15]': '1',
        'CantidadItem[15]': '32.00',
        'UnidadMedida[15]': '31',
        'PrecioUnitarioItem[15]': '135.0000',
        'MontoItem[15]': '4320.00',
        'NumeroLinea[16]': '16',
        'IndicadorFacturacion[16]': '4',
        'NombreItem[16]': 'MANZANAS GALA',
        'IndicadorBienoServicio[16]': '1',
        'CantidadItem[16]': '55.00',
        'UnidadMedida[16]': '31',
        'PrecioUnitarioItem[16]': '300.0000',
        'MontoItem[16]': '16500.00',
      },
      {
        Version: '1.0',
        TipoeCF: '34',
        ENCF: 'E340000000018',
        IndicadorNotaCredito: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        FechaEmision: '02-12-2018',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 01',
        MontoTotal: '0.00',
        MontoNoFacturable: '1.00',
        'NumeroLinea[1]': '01',
        'IndicadorFacturacion[1]': '0',
        'NombreItem[1]': 'AGUACATE CRIOLLO ACTUALIZADO',
        'IndicadorBienoServicio[1]': '2',
        'CantidadItem[1]': '1.00',
        'PrecioUnitarioItem[1]': '1.00',
        'MontoItem[1]': '1.00',
        NCFModificado: 'E460000000009',
        FechaNCFModificado: '01-12-2018',
        CodigoModificacion: '2',
        RazonModificacion: 'Error en datos',
      },
      {
        Version: '1.0',
        TipoeCF: '43',
        ENCF: 'E430000000012',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoPago: '1',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        FechaEmision: '01-04-2020',
        MontoExento: '32300.00',
        MontoTotal: '32300.00',
        'NumeroLinea[1]': '1',
        'TipoCodigo[1][1]': 'Interno',
        'CodigoItem[1][1]': '1521',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'Gastos de Oficina',
        'IndicadorBienoServicio[1]': '2',
        'CantidadItem[1]': '1',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '10000.0000',
        'MontoItem[1]': '10000.00',
        'NumeroLinea[2]': '2',
        'TipoCodigo[2][1]': 'Interno',
        'CodigoItem[2][1]': '1522',
        'IndicadorFacturacion[2]': '4',
        'NombreItem[2]': 'Gastos de Transporte',
        'IndicadorBienoServicio[2]': '2',
        'CantidadItem[2]': '1',
        'UnidadMedida[2]': '43',
        'PrecioUnitarioItem[2]': '5000.0000',
        'MontoItem[2]': '5000.00',
        'NumeroLinea[3]': '3',
        'TipoCodigo[3][1]': 'Interno',
        'CodigoItem[3][1]': '1523',
        'IndicadorFacturacion[3]': '4',
        'NombreItem[3]': 'Mantenimiento',
        'IndicadorBienoServicio[3]': '2',
        'CantidadItem[3]': '1',
        'UnidadMedida[3]': '43',
        'PrecioUnitarioItem[3]': '3500.0000',
        'MontoItem[3]': '3500.00',
        'NumeroLinea[4]': '4',
        'TipoCodigo[4][1]': 'Interno',
        'CodigoItem[4][1]': '1524',
        'IndicadorFacturacion[4]': '4',
        'NombreItem[4]': 'Gastos varios',
        'IndicadorBienoServicio[4]': '2',
        'CantidadItem[4]': '2',
        'UnidadMedida[4]': '43',
        'PrecioUnitarioItem[4]': '6500.0000',
        'MontoItem[4]': '13000.00',
        'NumeroLinea[5]': '5',
        'TipoCodigo[5][1]': 'Interno',
        'CodigoItem[5][1]': '1526',
        'IndicadorFacturacion[5]': '4',
        'NombreItem[5]': 'Gastos menor cuanta',
        'IndicadorBienoServicio[5]': '2',
        'CantidadItem[5]': '1',
        'UnidadMedida[5]': '43',
        'PrecioUnitarioItem[5]': '800.0000',
        'MontoItem[5]': '800.00',
      },
      {
        Version: '1.0',
        TipoeCF: '45',
        ENCF: 'E450000000011',
        FechaVencimientoSecuencia: '31-12-2025',
        IndicadorMontoGravado: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '96657.80',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        MontoGravadoTotal: '83390.00',
        MontoGravadoI1: '2430.00',
        MontoGravadoI2: '80190.00',
        MontoGravadoI3: '770.00',
        ITBIS1: '18',
        ITBIS2: '16',
        ITBIS3: '0',
        TotalITBIS: '13267.80',
        TotalITBIS1: '437.40',
        TotalITBIS2: '12830.40',
        TotalITBIS3: '0.00',
        MontoTotal: '96657.80',
        MontoPeriodo: '96657.80',
        ValorPagar: '96657.80',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'NombreItem[1]': 'LAPICES',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '23.00',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '35.0000',
        'PrecioOtraMoneda[1]': '3.55',
        'MontoItemOtraMoneda[1]': '81.65',
        'MontoItem[1]': '805.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '2',
        'NombreItem[2]': 'GALLETAS',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '547.00',
        'UnidadMedida[2]': '6',
        'PrecioUnitarioItem[2]': '145.0000',
        'PrecioOtraMoneda[2]': '4.55',
        'MontoItemOtraMoneda[2]': '2488.85',
        'MontoItem[2]': '79315.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '3',
        'NombreItem[3]': 'PAN',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '14.00',
        'UnidadMedida[3]': '31',
        'PrecioUnitarioItem[3]': '55.0000',
        'PrecioOtraMoneda[3]': '2.55',
        'MontoItemOtraMoneda[3]': '35.70',
        'MontoItem[3]': '770.00',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '1',
        'NombreItem[4]': 'SANDWICH',
        'IndicadorBienoServicio[4]': '1',
        'CantidadItem[4]': '25.00',
        'UnidadMedida[4]': '24',
        'PrecioUnitarioItem[4]': '65.0000',
        'PrecioOtraMoneda[4]': '1.75',
        'MontoItemOtraMoneda[4]': '43.75',
        'MontoItem[4]': '1625.00',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '2',
        'NombreItem[5]': 'SALSA',
        'IndicadorBienoServicio[5]': '1',
        'CantidadItem[5]': '35.00',
        'UnidadMedida[5]': '47',
        'PrecioUnitarioItem[5]': '25.0000',
        'MontoItem[5]': '875.00',
      },
      {
        Version: '1.0',
        TipoeCF: '47',
        ENCF: 'E470000000001',
        FechaVencimientoSecuencia: '31-12-2025',
        NumeroCuentaPago: 'BB00058745214789635111111111',
        BancoPago:
          'BB0111111111111111111111111111111111111111111111111111111111111111111111111',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010101',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        FechaEmision: '01-04-2020',
        IdentificadorExtranjero: '533445888',
        RazonSocialComprador: 'ALEJA FERMIN SANTOS',
        MontoExento: '180000.00',
        MontoTotal: '180000.00',
        TotalISRRetencion: '48600.00',
        TipoMoneda: 'USD',
        TipoCambio: '60.0000',
        MontoExentoOtraMoneda: '3000.00',
        MontoTotalOtraMoneda: '3000.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'IndicadorAgenteRetencionoPercepcion[1]': '1',
        'MontoISRRetenido[1]': '48600.00',
        'NombreItem[1]': 'LICENCIA WYI',
        'IndicadorBienoServicio[1]': '2',
        'CantidadItem[1]': '1.00',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '180000.00',
        'PrecioOtraMoneda[1]': '3000.0000',
        'MontoItemOtraMoneda[1]': '3000.00',
        'MontoItem[1]': '180000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '33',
        ENCF: 'E330000000001',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '400000.00',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '02-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '11-11-2020',
        FechaOrdenCompra: '10-11-2020',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        'NumeroContenedor ': '8019289',
        NumeroReferencia: '1447',
        MontoExento: '400000.00',
        MontoTotal: '400000.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '4',
        'NombreItem[1]': 'LECHE',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '10000.00',
        'UnidadMedida[1]': '47',
        'PrecioUnitarioItem[1]': '40.00',
        'MontoItem[1]': '400000.00',
        NCFModificado: 'E320000000006',
        FechaNCFModificado: '01-04-2020',
        CodigoModificacion: '3',
      },
      {
        Version: '1.0',
        TipoeCF: '32',
        ENCF: 'E320000000006',
        IndicadorMontoGravado: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        'FormaPago[1]': '1',
        'MontoPago[1]': '413785.30',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        MontoGravadoTotal: '350765.00',
        MontoGravadoI1: '269805.00',
        MontoGravadoI2: '80190.00',
        MontoGravadoI3: '770.00',
        MontoExento: '1625.00',
        ITBIS1: '18',
        ITBIS2: '16',
        ITBIS3: '0',
        TotalITBIS: '61395.30',
        TotalITBIS1: '48564.90',
        TotalITBIS2: '12830.40',
        TotalITBIS3: '0.00',
        MontoTotal: '413785.30',
        MontoPeriodo: '413785.30',
        ValorPagar: '413785.30',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'NombreItem[1]': 'LAPICES',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '23.00',
        'UnidadMedida[1]': '43',
        'PrecioUnitarioItem[1]': '35.0000',
        'MontoItem[1]': '805.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '2',
        'NombreItem[2]': 'GALLETAS',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '547.00',
        'UnidadMedida[2]': '6',
        'PrecioUnitarioItem[2]': '145.0000',
        'MontoItem[2]': '79315.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '3',
        'NombreItem[3]': 'PAN',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '14.00',
        'UnidadMedida[3]': '31',
        'PrecioUnitarioItem[3]': '55.0000',
        'MontoItem[3]': '770.00',
        'NumeroLinea[4]': '4',
        'IndicadorFacturacion[4]': '4',
        'NombreItem[4]': 'LECHE',
        'IndicadorBienoServicio[4]': '1',
        'CantidadItem[4]': '25.00',
        'UnidadMedida[4]': '47',
        'PrecioUnitarioItem[4]': '65.0000',
        'MontoItem[4]': '1625.00',
        'NumeroLinea[5]': '5',
        'IndicadorFacturacion[5]': '2',
        'NombreItem[5]': 'SALSA',
        'IndicadorBienoServicio[5]': '1',
        'CantidadItem[5]': '35.00',
        'UnidadMedida[5]': '47',
        'PrecioUnitarioItem[5]': '25.0000',
        'MontoItem[5]': '875.00',
        'NumeroLinea[6]': '6',
        'IndicadorFacturacion[6]': '1',
        'NombreItem[6]': 'TV LG 57"',
        'IndicadorBienoServicio[6]': '1',
        'CantidadItem[6]': '2.00',
        'UnidadMedida[6]': '43',
        'PrecioUnitarioItem[6]': '57000.0000',
        'MontoItem[6]': '114000.00',
        'NumeroLinea[7]': '7',
        'IndicadorFacturacion[7]': '1',
        'NombreItem[7]': 'LAVADORA-SECADORA  WESTINGHOUSE',
        'IndicadorBienoServicio[7]': '1',
        'CantidadItem[7]': '1.00',
        'UnidadMedida[7]': '43',
        'PrecioUnitarioItem[7]': '75000.0000',
        'MontoItem[7]': '75000.00',
        'NumeroLinea[8]': '8',
        'IndicadorFacturacion[8]': '1',
        'NombreItem[8]': 'ESTUFA MABE',
        'IndicadorBienoServicio[8]': '1',
        'CantidadItem[8]': '1.00',
        'UnidadMedida[8]': '43',
        'PrecioUnitarioItem[8]': '45000.0000',
        'MontoItem[8]': '45000.00',
        'NumeroLinea[9]': '9',
        'IndicadorFacturacion[9]': '1',
        'NombreItem[9]': 'LAPICES',
        'IndicadorBienoServicio[9]': '1',
        'CantidadItem[9]': '1.00',
        'UnidadMedida[9]': '43',
        'PrecioUnitarioItem[9]': '35000.0000',
        'MontoItem[9]': '35000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '46',
        ENCF: 'E460000000009',
        FechaVencimientoSecuencia: '31-12-2025',
        TipoIngresos: '01',
        TipoPago: '1',
        RNCEmisor: '132177975',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        Municipio: '010100',
        Provincia: '010000',
        'TelefonoEmisor[1]': '809-472-7676',
        'TelefonoEmisor[2]': '809-491-1918',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        WebSite: 'www.facturaelectronica.com',
        CodigoVendedor:
          'AA0000000100000000010000000002000000000300000000050000000006',
        NumeroFacturaInterna: '123456789016',
        NumeroPedidoInterno: '123456789016',
        ZonaVenta: 'NORTE',
        FechaEmision: '01-12-2018',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        ContactoComprador: 'MARCOS LATIPLOL',
        CorreoComprador: 'MARCOSLATIPLOL@KKKK.COM',
        DireccionComprador:
          'CALLE JACINTO DE LA CONCHA FELIZ ESQUINA 27 DE FEBRERO,FRENTE A DOMINO',
        MunicipioComprador: '010100',
        ProvinciaComprador: '010000',
        FechaEntrega: '10-10-2020',
        FechaOrdenCompra: '10-11-2018',
        NumeroOrdenCompra: '4500352238',
        CodigoInternoComprador: '10633440',
        Conductor: 'Rafael Perez',
        DocumentoTransporte: '363636',
        Ficha: 'J-1234',
        Placa: 'A639689',
        RutaTransporte: 'B-Sur',
        ZonaTransporte: 'Interior-1',
        NumeroAlbaran: '3634258',
        MontoGravadoTotal: '117500.00',
        MontoGravadoI3: '117500.00',
        ITBIS3: '0',
        TotalITBIS: '0.00',
        TotalITBIS3: '0.00',
        MontoTotal: '117500.00',
        MontoPeriodo: '117500.00',
        ValorPagar: '117500.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '3',
        'NombreItem[1]': 'Sardinas',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '150.00',
        'UnidadMedida[1]': '6',
        'PrecioUnitarioItem[1]': '450.0000',
        'MontoItem[1]': '67500.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '3',
        'NombreItem[2]': 'Habicuelas',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '100.00',
        'UnidadMedida[2]': '6',
        'PrecioUnitarioItem[2]': '200.0000',
        'MontoItem[2]': '20000.00',
        'NumeroLinea[3]': '3',
        'IndicadorFacturacion[3]': '3',
        'NombreItem[3]': 'Gandules',
        'IndicadorBienoServicio[3]': '1',
        'CantidadItem[3]': '120.00',
        'UnidadMedida[3]': '6',
        'PrecioUnitarioItem[3]': '250.0000',
        'MontoItem[3]': '30000.00',
      },
      {
        Version: '1.0',
        TipoeCF: '32',
        ENCF: 'E320000000011',
        IndicadorMontoGravado: '0',
        TipoIngresos: '01',
        TipoPago: '1',
        RNCEmisor: '132177975',
        RazonSocialEmisor:
          'DOCUMENTOS ELECTRONICOS PRUEBA FACTURA DE CONSUMO MENOR 250MIL',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        'TelefonoEmisor[1]': '809-472-7676',
        CorreoEmisor: 'DOCUMENTOSELECTRONICOS@123.COM',
        InformacionAdicionalEmisor: 'string',
        FechaEmision: '01-04-2020',
        RNCComprador: '131880681',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 03',
        CorreoComprador: 'DOCUMENTOSELECTRONICOSDE0612345678969789@123.COM',
        DireccionComprador:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        MunicipioComprador: '170203',
        ProvinciaComprador: '170000',
        TelefonoAdicional: '809-472-7676',
        MontoGravadoTotal: '34000.00',
        MontoGravadoI1: '34000.00',
        ITBIS1: '18',
        TotalITBIS: '6120.00',
        TotalITBIS1: '6120.00',
        MontoTotal: '40120.00',
        'NumeroLinea[1]': '1',
        'IndicadorFacturacion[1]': '1',
        'NombreItem[1]': 'Cargador',
        'IndicadorBienoServicio[1]': '1',
        'CantidadItem[1]': '1',
        'UnidadMedida[1]': '55',
        'PrecioUnitarioItem[1]': '5000.00',
        'MontoItem[1]': '5000.00',
        'NumeroLinea[2]': '2',
        'IndicadorFacturacion[2]': '1',
        'NombreItem[2]': 'FREEZER',
        'IndicadorBienoServicio[2]': '1',
        'CantidadItem[2]': '1',
        'UnidadMedida[2]': '23',
        'PrecioUnitarioItem[2]': '29000.00',
        'MontoItem[2]': '29000.00',
      },
      {
        MontoTotal: '0.00',
        MontoNoFacturable: '1.00',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 01',
        CodigoModificacion: '2',
        RNCComprador: '131880681',
        TipoIngresos: '01',
        RazonModificacion: 'Error en datos',
        ENCF: 'E340000000018',
        TipoPago: '1',
        DireccionEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        IndicadorNotaCredito: '0',
        'NombreItem[1]': 'AGUACATE CRIOLLO ACTUALIZADO',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        'CantidadItem[1]': '1.00',
        'MontoItem[1]': '1.00',
        NCFModificado: 'E460000000001',
        'IndicadorBienoServicio[1]': '2',
        'PrecioUnitarioItem[1]': '1.00',
        FechaNCFModificado: '01-12-2018',
        FechaEmision: '02-12-2018',
        RNCEmisor: '130820007',
        'IndicadorFacturacion[1]': '0',
        'NumeroLinea[1]': '1',
        Version: '1.0',
        TipoeCF: '34',
      },
      {
        'TelefonoEmisor[2]': '809-491-1918',
        RazonSocialEmisor: 'DOCUMENTOS ELECTRONICOS DE 02',
        'MontoISRRetenido[1]': '583.28',
        'SubRecargoPorcentaje[4][1]': '1.00',
        'TipoSubRecargo[1][1]': '%',
        RNCComprador: '533445861',
        'UnidadMedida[4]': '15',
        'NumeroLinea[3]': '3',
        'CantidadItem[1]': '15.00',
        'MontosubRecargo[1][1]': '57.75',
        'MontoISRRetenido[3]': '227.25',
        'UnidadMedida[2]': '43',
        'TipoSubRecargo[4][1]': '%',
        TotalITBIS1: '2891.53',
        'MontoItem[4]': '4297.55',
        'NombreItem[1]': 'Servicio Profesional Legislativo',
        'IndicadorFacturacion[5]': '1',
        'NumeroLinea[5]': '5',
        'PrecioUnitarioItem[4]': '185.0000',
        'RecargoMonto[5]': '8.75',
        'MontoItem[5]': '883.75',
        'IndicadorBienoServicio[5]': '2',
        'NumeroLinea[4]': '4',
        'TipoSubRecargo[5][1]': '%',
        TotalISRRetencion: '1606.41',
        'TipoSubRecargo[2][1]': '%',
        'CantidadItem[5]': '7.00',
        'TipoSubRecargo[3][1]': '%',
        'IndicadorFacturacion[1]': '1',
        'UnidadMedida[3]': '13',
        'CantidadItem[2]': '5.00',
        'UnidadMedida[5]': '23',
        'RecargoMonto[2]': '27.50',
        'IndicadorBienoServicio[1]': '2',
        CasoPrueba: '130820007E410000000007',
        'NombreItem[3]': 'Gestiones Legales',
        'IndicadorAgenteRetencionoPercepcion[4]': '1',
        'IndicadorBienoServicio[3]': '2',
        'SubRecargoPorcentaje[2][1]': '1.00',
        'IndicadorFacturacion[4]': '1',
        'MontoPago[1]': '18955.58',
        CorreoEmisor:
          'DOCUMENTOSELECTRONICOSDE0612345678969789+9000000000000000000000000000001@123.COM',
        ITBIS1: '18',
        NombreComercial: 'DOCUMENTOS ELECTRONICOS DE 02',
        TipoeCF: '41',
        TipoPago: '1',
        'MontoITBISRetenido[1]': '1040.90',
        'MontoItem[2]': '2777.50',
        'TelefonoEmisor[1]': '809-472-7676',
        'RecargoMonto[1]': '57.75',
        FechaEmision: '01-04-2020',
        'MontosubRecargo[5][1]': '8.75',
        'IndicadorFacturacion[2]': '1',
        'MontosubRecargo[4][1]': '42.55',
        'PrecioUnitarioItem[1]': '385.0000',
        Version: '1.0',
        ENCF: 'E410000000007',
        'NumeroLinea[2]': '2',
        'PrecioUnitarioItem[3]': '250.0000',
        DireccionEmisor:
          'AVE. ISABEL AGUIAR NO. 269, ZONA INDUSTRIAL DE HERRERA',
        FechaVencimientoSecuencia: '31-12-2025',
        'SubRecargoPorcentaje[3][1]': '1.00',
        MontoTotal: '18955.58',
        'IndicadorBienoServicio[4]': '2',
        'MontoITBISRetenido[2]': '490.95',
        Provincia: '010000',
        'RecargoMonto[3]': '22.50',
        'CantidadItem[3]': '9.00',
        'SubRecargoPorcentaje[1][1]': '1.00',
        'PrecioUnitarioItem[5]': '125.0000',
        'MontoItem[3]': '2272.50',
        'IndicadorBienoServicio[2]': '2',
        'NombreItem[2]': 'Asesoria Legal',
        'MontosubRecargo[2][1]': '27.50',
        'IndicadorAgenteRetencionoPercepcion[1]': '1',
        'MontoITBISRetenido[5]': '150.08',
        IndicadorMontoGravado: '0',
        'CantidadItem[4]': '23.00',
        'NombreItem[4]': 'Legalizacion de documentos',
        'IndicadorAgenteRetencionoPercepcion[5]': '1',
        'IndicadorFacturacion[3]': '1',
        'NumeroLinea[1]': '1',
        'MontoISRRetenido[4]': '429.76',
        MontoGravadoTotal: '16064.05',
        'FormaPago[1]': '1',
        'SubRecargoPorcentaje[5][1]': '1.00',
        'MontoITBISRetenido[3]': '400.05',
        'IndicadorAgenteRetencionoPercepcion[3]': '1',
        'MontoItem[1]': '5832.75',
        'MontoISRRetenido[5]': '88.38',
        'IndicadorAgenteRetencionoPercepcion[2]': '1',
        'MontoISRRetenido[2]': '277.75',
        'MontoITBISRetenido[4]': '764.56',
        TotalITBIS: '2891.53',
        RNCEmisor: '130820007',
        'RecargoMonto[4]': '42.55',
        Municipio: '010100',
        'PrecioUnitarioItem[2]': '550.0000',
        TotalITBISRetenido: '2846.53',
        'MontosubRecargo[3][1]': '22.50',
        RazonSocialComprador: 'DOCUMENTOS ELECTRONICOS DE 11',
        MontoGravadoI1: '16064.05',
        'UnidadMedida[1]': '23',
        'NombreItem[5]': 'Servicios ambulatorio',
      },
    ];
    const ref = collection(this.firestore, 'encfFacturas');
    const q = query(ref, where('RNCEmisor', '==', this.empresaID));

    collectionData(q, { idField: 'id' }).subscribe((docs) => {
      this.agruparPorTipo(docs);
    });
    this.obtenerDatosEmpresa();
  }

  parseXML(xmlString: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
  }

  agruparPorTipo(data: any[]) {
    const agrupados: Record<string, any[]> = {};

    this.comprobantes32Mayor = [];
    this.comprobantes32Menor = [];

    for (const item of data) {
      const tipo = item.TipoeCF?.toString();
      const monto = parseFloat(item.MontoTotal || '0');

      if (tipo === '32') {
        if (monto >= 250000) {
          this.comprobantes32Mayor.push(item);
        } else {
          this.comprobantes32Menor.push(item);
        }
      } else {
        if (!agrupados[tipo]) agrupados[tipo] = [];
        agrupados[tipo].push(item);
      }
    }

    this.comprobantesAgrupados = agrupados;
  }

  // guardarDatos() {
  //     this.encfService.guardarJsonSimple(this.jsonData, this.empresaID);
  // }

  enviarComprobante(comprobante: any) {
    // Aquí iría la lógica real de envío...
    // luego puedes actualizar el estado en Firebase si se requiere
    console.log('Enviando:', comprobante);
  }

  contarEnviados(lista: any[]): number {
    return lista.filter((item) => item.estado === 'enviado').length;
  }

  contarTiposPersonalizado() {
    const resumen: Record<string, number> = {
      '31': 0,
      '32 >= 250000': 0,
      '32 < 250000': 0,
      '33': 0,
      '43': 0,
      '44': 0,
      '45': 0,
      '46': 0,
      '47': 0,
    };

    for (const item of this.jsonData) {
      const tipo = item.TipoeCF;
      const monto = parseFloat(item.MontoTotal);

      if (tipo === '32') {
        if (monto >= 250000) {
          resumen['32 >= 250000']++;
        } else {
          resumen['32 < 250000']++;
        }
      } else if (resumen[tipo] !== undefined) {
        resumen[tipo]++;
      }
    }

    this.resumenTipos = resumen;
  }

  generarComprobantesDesdeBase(
    baseJson: any[],
    rncPersonalizado: string
  ): any[] {
    const cantidadPorTipo: Record<string, number> = {
      '31': 4,
      '32 >= 250000': 2,
      '32 < 250000': 4,
      '33': 1,
      '34': 2, // Nota de Crédito
      '41': 2,
      '43': 2,
      '44': 2,
      '45': 2,
      '46': 2, // Documento a modificar por la Nota de Crédito
      '47': 2,
    };

    const inicioPorTipo: Record<string, number> = {
      '31': 200,
      '32 >= 250000': 200,
      '32 < 250000': 200,
      '33': 200,
      '34': 200,
      '41': 200,
      '43': 200,
      '44': 200,
      '45': 200,
      '46': 200,
      '47': 200,
    };

    const listaFinal: any[] = [];

    for (const key in cantidadPorTipo) {
      const cantidad = cantidadPorTipo[key];
      let tipoReal = key.includes('32') ? '32' : key;

      const plantilla = baseJson.find(
        (f) =>
          String(f.TipoeCF) === tipoReal && this.matchMonto(key, f.MontoTotal)
      );

      if (!plantilla) continue;

      const inicio = inicioPorTipo[key] || 1;

      for (let i = 0; i < cantidad; i++) {
        const copia = { ...plantilla };
        copia.RNCEmisor = rncPersonalizado;
        copia.RazonSocialEmisor = this.empresaNombre;
        const secuencia = inicio + i;
        copia.ENCF = `E${tipoReal}${String(secuencia).padStart(10, '0')}`;
        copia.CasoPrueba = rncPersonalizado + copia.ENCF;
        listaFinal.push(copia);
      }
    }

    // 🔁 Vincular una factura tipo 34 con una tipo 46 (NCFModificado)
    const factura46 = listaFinal.find((f) => f.TipoeCF === '46');
    const factura34s = listaFinal.filter((f) => f.TipoeCF === '34');

    if (factura46 && factura34s.length > 0) {
      for (const factura34 of factura34s) {
        factura34.NCFModificado = factura46.ENCF;
        factura34.FechaNCFModificado = factura46.FechaEmision || '01-01-2020';
        factura34.CodigoModificacion = factura34.CodigoModificacion || '2';
        factura34.RazonModificacion =
          factura34.RazonModificacion || 'Error en datos';
      }
    }

    return listaFinal;
  }

  private matchMonto(clave: string, montoStr: string): boolean {
    const monto = parseFloat(montoStr || '0');

    if (clave === '32 >= 250000') return monto >= 250000;
    if (clave === '32 < 250000') return monto < 250000;
    return true;
  }

  generarYGuardar() {
    const lista = this.generarComprobantesDesdeBase(
      this.jsonData,
      this.empresaID
    );
    this.encfService.guardarJsonSimple(lista);
  }

  sentToDgii(datos: any) {
    this.isLoadingSend = true;
    const payload = { scenarios: [datos] }; // 👈 Envolver en { scenarios: [ datos ] }

    console.log('Datos a enviar a DGII:', payload);

    this.dgiiService.sentToDgii(payload).subscribe(
      async (response) => {
        console.log('✅ Respuesta de DGII:', response);
        this.isLoadingSend = false;

        if (
          response.status === 'success' &&
          response.data?.results?.length > 0
        ) {
          const updates = response.data.results.map((result: any) => {
            const { scenario } = result;

            const rfceData = result.responseRFCE?.dgiiResponse;
            const rfceAlt = result.dgii; // formato alterno: { status, message, dgii }
            const rfceXmlUrl = result.responseRFCE?.xmlPublicUrl;

            const xmlPublicUrl = result.responseXML?.xmlPublicUrl;
            const xmlResponseData = result.responseXML?.dgiiResponse; // puede no existir

            const trackId = rfceData?.trackId || xmlResponseData?.trackId;

            console.log(trackId);

            const tipo = String(scenario?.TipoeCF ?? '').trim();
            const montoTotalNum =
              parseFloat(
                String(scenario?.MontoTotal ?? '0').replace(/,/g, '')
              ) || 0;

            const dataToUpdate: any = {
              // Mostrar SIEMPRE el XML del ECF, no el RFCE
              xmlPublicUrl: xmlPublicUrl ?? '',
              trackId: trackId ?? '',
            };

            // Establecer estatus según reglas:
            // - Para E32 < 250,000 usar el estado que viene en responseRFCE
            // - Para otros tipos, usar la respuesta del ECF (responseXML)
            if (
              tipo === '32' &&
              montoTotalNum < 250000 &&
              (rfceData?.estado || rfceAlt?.estado)
            ) {
              const estado = String(
                (rfceData?.estado ?? rfceAlt?.estado) || ''
              ).toLowerCase();
              dataToUpdate.estatus =
                estado === 'aceptado' ? 'Aceptado' : 'Rechazado';
            } else if (
              xmlResponseData?.trackId ||
              typeof xmlResponseData?.estado !== 'undefined'
            ) {
              const estadoXml = String(
                xmlResponseData?.estado || ''
              ).toLowerCase();
              if (estadoXml) {
                dataToUpdate.estatus =
                  estadoXml === 'aceptado' ? 'Aceptado' : 'Rechazado';
              } else if (!xmlResponseData?.error) {
                // Sin estado explícito del ECF: mantener como 'Firmado' hasta consultar por trackId
                dataToUpdate.estatus = 'Firmado';
              } else {
                dataToUpdate.estatus = 'Firmado';
              }
            } else {
              dataToUpdate.estatus = 'Firmado';
            }

            const documentId = scenario.id;

            if (documentId) {
              const docRef = doc(this.firestore, 'encfFacturas', documentId);
              updateDoc(docRef, dataToUpdate);

              // Mostrar alerta inmediata basada en RFCE para E32 < 2,500,000
              if (
                tipo === '32' &&
                montoTotalNum < 250000 &&
                (rfceData?.estado || rfceAlt?.estado)
              ) {
                const estado = String(
                  (rfceData?.estado ?? rfceAlt?.estado) || ''
                ).toLowerCase();
                const nuevoEstado =
                  estado === 'aceptado' ? 'Aceptado' : 'Rechazado';
                const mensaje =
                  rfceData?.mensajes?.[0]?.valor ||
                  rfceAlt?.mensajes?.[0]?.valor ||
                  result.responseRFCE?.message ||
                  result.message ||
                  '';
                Swal.fire({
                  icon: nuevoEstado === 'Rechazado' ? 'error' : 'success',
                  title: nuevoEstado,
                  text: mensaje,
                });
              }

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
            console.error(
              '❌ Error actualizando documentos en Firebase:',
              error
            );
          }
        } else {
          this.isLoadingSend = false;
          console.error('❌ Error en respuesta de DGII o no hay resultados');
          alert('❌ Error en respuesta de DGII o no hay resultados');
        }
      },
      (error) => {
        this.isLoadingSend = false;
        console.error('❌ Error al enviar a DGII:', error);
        alert(`❌ Error al enviar a DGII: ${error}`);
      }
    );
  }

  getStatusByTrackID(trackId: string, firebaseId: string): void {
    this.dgiiService.getStatusByTrackID(trackId, this.empresaID!).subscribe({
      next: (response) => {
        console.log('Respuesta completa de DGII:', response);

        if (response.status === 'success' && response.data?.dgiiResponse) {
          const dgiiResponse = response.data.dgiiResponse;
          const estadoRaw = String(dgiiResponse.estado || '').toLowerCase();
          const nuevoEstado =
            estadoRaw === 'aceptado' ? 'Aceptado' : 'Rechazado';

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
      },
    });
  }

  actualizarEstatusEnFirebase(firebaseId: string, nuevoEstado: string): void {
    const documentoRef = doc(this.firestore, 'encfFacturas', firebaseId); // 👈 Ajusta 'TuColeccion'

    updateDoc(documentoRef, {
      estatus: nuevoEstado,
    })
      .then(() => {
        console.log('✅ Estatus actualizado en Firebase:', nuevoEstado);
      })
      .catch((error) => {
        console.error('❌ Error actualizando estatus en Firebase:', error);
      });
  }

  resetearDatos() {
    this.loadingReset = true;
    this.encfService
      .resetearENCFs(this.empresaID, this.empresaNombre)
      .then((response) => {
        this.loadingReset = false;
      });
  }

  verXmlPublicUrl(xmlPublicUrl: string): void {
    console.log('URL del XML público:', xmlPublicUrl);
    const cleanUrl = (xmlPublicUrl || '').replace(/`/g, '').trim();
    this.dgiiService.getXmlContent(cleanUrl).subscribe({
      next: (xml: string) => {
        const formatted = this.formatXml(xml);
        this.xmlContent = this.highlightXml(formatted);
        this.showXmlModal = true;
      },
      error: (error) => {
        console.error('❌ Error cargando XML:', error);
      },
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

  highlightXml(xml: string): string {
    return hljs.highlight(xml, { language: 'xml' }).value;
  }

  selectedXmlString: string = '';

  verFactura(xmlPublicUrl: string) {
    this.dgiiService.getXmlContent(xmlPublicUrl).subscribe({
      next: (xml: string) => {
        // const formatted = this.formatXml(xml);
        // this.xmlContent = this.highlightXml(formatted);
        // Limpiar valores previos para evitar arrastre de estado entre facturas
        this.FechaVencimientoSecuencia = '';
        this.parsearFactura(xml);

        // Mostrar modal con configuración para no cerrar con clic fuera ni ESC
        $('#facturaModal').modal({ backdrop: 'static', keyboard: false });
        $('#facturaModal').modal('show');
      },
      error: (error) => {
        console.error('❌ Error cargando XML:', error);
      },
    });
  }

  parsearFactura(xmlString: string): void {
    /* ---------- 1. Parsear XML ---------- */
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');

    this.ENCF = doc.querySelector('eNCF')?.textContent?.trim() ?? '';
    this.RNCEmisor = doc.querySelector('RNCEmisor')?.textContent?.trim() ?? '';
    this.RNCComprador =
      doc.querySelector('RNCComprador')?.textContent?.trim() ?? '';
    this.FechaEmision =
      doc.querySelector('FechaEmision')?.textContent?.trim() ?? '';
    this.MontoTotal =
      doc.querySelector('MontoTotal')?.textContent?.trim() ?? '';
    // Totales visibles en la factura
    this.subTotal =
      doc.querySelector('MontoGravadoTotal')?.textContent?.trim() ?? '';
    this.itbis = doc.querySelector('TotalITBIS')?.textContent?.trim() ?? '';
    this.FechaFirma =
      doc.querySelector('FechaHoraFirma')?.textContent?.trim() ?? '';
    this.CodigoSeguridad = (
      doc.querySelector('SignatureValue')?.textContent ?? ''
    ).substring(0, 6);

    // Datos adicionales para cumplir con requisitos de DGII
    this.RazonSocialEmisor =
      doc.querySelector('RazonSocialEmisor')?.textContent?.trim() ?? '';
    this.nombreComercialEmisor =
      doc.querySelector('NombreComercial')?.textContent?.trim() ?? '';
    this.DireccionEmisor =
      doc.querySelector('DireccionEmisor')?.textContent?.trim() ?? '';

    this.RazonSocialComprador =
      doc.querySelector('RazonSocialComprador')?.textContent?.trim() ?? '';
    this.DireccionComprador =
      doc.querySelector('DireccionComprador')?.textContent?.trim() ?? '';

    const fechaVenc = doc
      .querySelector('FechaVencimientoSecuencia')
      ?.textContent?.trim();
    this.FechaVencimientoSecuencia = fechaVenc || '';

    this.ncfModificado =
      doc.querySelector('NCFModificado')?.textContent?.trim() ?? '';

    const posiblePuntoEmision =
      (doc.querySelector('PuntoEmision')?.textContent ?? '').trim() ||
      (doc.querySelector('Sucursal')?.textContent ?? '').trim() ||
      (doc.querySelector('PuntoDeEmision')?.textContent ?? '').trim();
    this.puntoEmision = posiblePuntoEmision || '';

    this.FechaFirmaFormateada = this.formatearFechaDDMMAAAA(this.FechaFirma);

    /* ---------- 2. Datos del tipo ---------- */
    const tipoStr = (doc.querySelector('TipoeCF')?.textContent ?? '').trim(); // '47', '43', …
    const monto = parseFloat(this.MontoTotal.replace(/,/g, ''));
    const esFCMenor = tipoStr === '32' && monto < 250_000;

    /* ---------- 3. Construir URL ---------- */
    const baseUrl = esFCMenor
      ? 'https://fc.dgii.gov.do/CerteCF/ConsultaTimbreFC'
      : 'https://ecf.dgii.gov.do/CerteCF/ConsultaTimbre';

    const params: Record<string, string> = {
      RncEmisor: this.RNCEmisor,
      ENCF: this.ENCF,
      MontoTotal: this.MontoTotal,
      CodigoSeguridad: this.CodigoSeguridad,
    };

    if (!esFCMenor) {
      params['FechaEmision'] = this.FechaEmision;
      params['FechaFirma'] = this.FechaFirma;
    }

    /* ----- Reglas DGII para RNCComprador ----- */
    const rncComprador = this.RNCComprador;
    console.log(rncComprador);
    const debeLlevarRNC =
      tipoStr !== '47' && !(tipoStr === '43' && rncComprador === '');

    if (debeLlevarRNC) {
      params['RncComprador'] = rncComprador; // ← único punto donde se añade
    }

    this.qrUrl = `${baseUrl}?${new URLSearchParams(params).toString()}`;
    console.log('QR URL:', this.qrUrl);

    /* ---------- 4. Encabezado legal ---------- */
    this.encabezadoComprobante = this.obtenerEncabezadoComprobante(
      tipoStr,
      this.MontoTotal
    );

    /* ---------- 5. Productos ---------- */
    this.productos = Array.from(doc.querySelectorAll('Item')).map((item) => ({
      NumeroLinea: item.querySelector('NumeroLinea')?.textContent?.trim() ?? '',
      NombreItem: item.querySelector('NombreItem')?.textContent?.trim() ?? '',
      CantidadItem:
        item.querySelector('CantidadItem')?.textContent?.trim() ?? '',
      PrecioUnitarioItem:
        item.querySelector('PrecioUnitarioItem')?.textContent?.trim() ?? '',
      MontoItem: item.querySelector('MontoItem')?.textContent?.trim() ?? '',
    }));
  }

  private formatearFechaDDMMAAAA(fecha: string): string {
    if (!fecha) return '';
    const iso = fecha.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
      const [, y, m, d] = iso;
      return `${d}-${m}-${y}`;
    }
    const dmy = fecha.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (dmy) {
      const [, d, m, y] = dmy;
      return `${d}-${m}-${y}`;
    }
    try {
      const dt = new Date(fecha);
      if (!isNaN(dt.getTime())) {
        const d = String(dt.getDate()).padStart(2, '0');
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const y = dt.getFullYear();
        return `${d}-${m}-${y}`;
      }
    } catch {}
    return fecha;
  }

  descargarPDF() {
    const data = document.getElementById('facturaPDF');
    if (!data) return;

    // Clonar el contenido para fijar un ancho tipo A4 y evitar el viewport móvil
    const clone = data.cloneNode(true) as HTMLElement;
    clone.id = 'facturaPDF_clone';
    // Forzar tema claro en el clon del contenido
    clone.setAttribute('data-bs-theme', 'light');
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';
    // Ajustar variables de Bootstrap para asegurar colores claros dentro del clon
    clone.style.setProperty('--bs-body-bg', '#ffffff');
    clone.style.setProperty('--bs-body-color', '#000000');
    // Tablas dentro del clon
    Array.from(clone.querySelectorAll('table')).forEach((t) => {
      const el = t as HTMLElement;
      el.style.setProperty('--bs-table-bg', '#ffffff');
      el.style.setProperty('--bs-table-color', '#000000');
      el.style.setProperty('--bs-table-striped-bg', '#f8f9fa');
      el.style.setProperty('--bs-table-striped-color', '#000000');
      el.style.setProperty('--bs-table-border-color', '#dee2e6');
    });
    Object.assign(clone.style, {
      width: '794px', // ~ A4 a 96dpi
      background: '#ffffff',
      position: 'fixed',
      left: '-10000px',
      top: '0',
      padding: '16px',
      boxSizing: 'border-box',
    } as Partial<CSSStyleDeclaration>);
    document.body.appendChild(clone);

    html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginX = 10;
        const marginY = 10;
        const usableWidth = pdfWidth - marginX * 2;
        let drawHeight = (canvas.height * usableWidth) / canvas.width;

        if (drawHeight > pdfHeight - marginY * 2) {
          drawHeight = pdfHeight - marginY * 2; // escalar para caber en una página
        }

        pdf.addImage(
          imgData,
          'JPEG',
          marginX,
          marginY,
          usableWidth,
          drawHeight
        );
        pdf.save(`${this.ENCF}.pdf`);
      })
      .finally(() => {
        // Limpiar el clon
        if (clone && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
  }

  obtenerDatosEmpresa() {
    const coleccionRef = collection(this.firestore, 'configuracionEmpresa');
    const q = query(coleccionRef, where('rnc', '==', this.empresaID));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      const empresa = data && data.length ? data[0] : ({} as any);
      this.empresaLogo = empresa['logoURL'] || this.empresaLogo;
      this.empresaNombre =
        empresa['nombreEmpresa'] || empresa['nombre'] || this.empresaNombre;
      this.empresaDireccion =
        empresa['direccionEmpresa'] || empresa['direccion'] || '';
    });
  }

  obtenerEncabezadoComprobante(
    tipo: number | string,
    montoTotal: string
  ): string {
    const tipoStr = tipo.toString();
    const monto = parseFloat(montoTotal.replace(/,/g, ''));

    switch (tipoStr) {
      case '31':
        return 'Factura de Crédito Fiscal Electrónica';
      case '32':
        return 'Factura de Consumo Electrónica';
      case '33':
        return 'Nota de Débito Electrónica';
      case '34':
        return 'Nota de Crédito Electrónica';
      case '41':
        return 'Compras Electrónico';
      case '43':
        return 'Gastos Menores Electrónico';
      case '44':
        return 'Regímenes Especiales Electrónico';
      case '45':
        return 'Gubernamental Electrónico';
      case '46':
        return 'Comprobante de Exportaciones Electrónico';
      case '47':
        return 'Comprobante para Pagos al Exterior Electrónico';
      default:
        return 'Comprobante Electrónico';
    }
  }
}
