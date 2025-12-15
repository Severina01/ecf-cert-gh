import { Component, OnInit } from '@angular/core';
declare var $: any;
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

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  empresaID = '';
  dataOriginal: any[] = [];
  datasEmpresa: any[] = [];
  aceptados = 0;
  rechazados = 0;
  pendientes = 0;
  total = 0;
  tasaAceptacion = 0;
  isLoading = true;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.empresaID = localStorage.getItem('empresaId')!;
    this.obtenerDesdeFirebase();
    this.obtenerDatosEmpresa();
  }

  obtenerDesdeFirebase(): void {
    const coleccionRef = collection(this.firestore, 'DataFromExcel');
    const q = query(coleccionRef, where('EmpresaID', '==', this.empresaID));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.dataOriginal = data;
      console.log(this.dataOriginal);
      this.aceptados = data.filter(
        (item) => item['estatus'] === 'Aceptado'
      ).length;
      this.rechazados = data.filter(
        (item) => item['estatus'] === 'Rechazado'
      ).length;
      this.pendientes = data.filter(
        (item) => item['estatus'] === 'Pendiente'
      ).length;
      this.total = data.length;
      this.tasaAceptacion = this.total
        ? Math.round((this.aceptados / this.total) * 100)
        : 0;
    });
  }

  obtenerDatosEmpresa() {
    if (!this.empresaID) {
      console.error('empresaID no está disponible aún.');
      return;
    }
    const coleccionRef = collection(this.firestore, 'configuracionEmpresa');
    const q = query(coleccionRef, where('rnc', '==', this.empresaID));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.datasEmpresa = data;
      console.log(this.datasEmpresa);
      this.isLoading = false;
    });
  }
}
