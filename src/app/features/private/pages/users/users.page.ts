import { Component, OnInit, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
declare var $: any;
import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    query,
    where
} from '@angular/fire/firestore';
import { supabase } from 'src/app/supabaseClient';


@Component({
    selector: 'app-users-page',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
})


export class UsersPage implements OnInit {
    empresaForm!: FormGroup;
    usuariosForm!: FormGroup;
    guardadoExitoso = false;
    errorGuardado: string | null = null;
    certificadoSeleccionado = false;
    certificado: File | null = null;
    certificadoUrl: string | null = null;
    isLoading = false;
    empresaData: any[] = [];
    usuariosData: any[] = [];

    constructor(
        private fb: FormBuilder,
        private firestore: Firestore,
    ) {
    }






    ngOnInit(): void {
        this.buildForm();
        this.buildFormUsuario();
        this.obtenerDatosEmpresa();
        this.obtenerDatosUsuarios();
    }

    buildForm() {
        this.empresaForm = this.fb.group({
            rnc: ['', Validators.required],
            nombreEmpresa: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', Validators.required],
            direccion: ['',],
        });
    }

    buildFormUsuario() {
        this.usuariosForm = this.fb.group({
            nombre: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            role: ['', Validators.required],
            empresaID: ['', Validators.required],
        });
    }


    async guardarUsuario() {
        if (this.usuariosForm.valid) {
            this.guardadoExitoso = false;
            this.errorGuardado = null;
            this.isLoading = true;

            try {
                console.log('✅ Formulario válido, comenzando subida de certificado...');

                await addDoc(collection(this.firestore, 'usuarios'), {
                    nombre: this.usuariosForm.get('nombre')?.value,
                    username: this.usuariosForm.get('username')?.value,
                    password: this.usuariosForm.get('password')?.value,
                    role: this.usuariosForm.get('role')?.value,
                    empresaID: this.usuariosForm.get('empresaID')?.value,
                    isActive: true,
                    createdAt: new Date()
                });
                this.guardadoExitoso = true;
                this.usuariosForm.reset();
                this.buildFormUsuario();
                $('#exampleModalUsuarios').modal('hide');
            } catch (error) {
                console.error('Error al crear usuario:', error);
            }

        }
    }

    async guardarConfiguracion() {
        if (this.empresaForm.valid) {
            this.guardadoExitoso = false;
            this.errorGuardado = null;

            try {
                console.log('✅ Formulario válido, comenzando subida de certificado...');




                const certificadoUrl = '';
                // 3️⃣ Guardar en Firestore junto con la URL
                await addDoc(collection(this.firestore, 'configuracionEmpresa'), {
                    rnc: this.empresaForm.get('rnc')?.value.toString(),
                    nombreEmpresa: this.empresaForm.get('nombreEmpresa')?.value,
                    email: this.empresaForm.get('email')?.value,
                    telefono: this.empresaForm.get('telefono')?.value,
                    direccion: this.empresaForm.get('direccion')?.value,
                    certificadoUrl: '',
                    contrasenaCertificado: '',
                    fechaGuardado: new Date()
                });

                this.guardadoExitoso = true;
                this.empresaForm.reset();
                this.buildForm();
                $('#exampleModal').modal('hide');
            } catch (error: any) {
                console.error('❌ Error en todo el proceso:', error.message);
                this.errorGuardado = error.message;
            }
        } else {

            console.log('Formulario inválido');
            console.log(this.empresaForm.errors);
            console.log(this.empresaForm.value);

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
        // const q = query(coleccionRef, where('EmpresaID', '==', this.empresaId));

        collectionData(coleccionRef, { idField: 'id' }).subscribe((data) => {
            this.empresaData = data;
        });
    }

    obtenerDatosUsuarios() {
        const coleccionRef = collection(this.firestore, 'usuarios');
        // const q = query(coleccionRef, where('EmpresaID', '==', this.empresaId));

        collectionData(coleccionRef, { idField: 'id' }).subscribe((data) => {
            this.usuariosData = data;
        });
    }






}

