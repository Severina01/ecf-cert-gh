import { Component, OnInit, } from "@angular/core";
import { FirmaService } from "src/app/core/services/firma/firma.service";
declare var $: any;

@Component({
    selector: 'app-firma-page',
    templateUrl: './firma.page.html',
    styleUrls: ['./firma.page.scss'],
})


export class FirmaPage implements OnInit {
    empresaID = '';
    isLoading = true;
    selectedFile: File | null = null;



    constructor(
        private firmaService: FirmaService
    ) {
    }

    ngOnInit(): void {
        this.empresaID = localStorage.getItem('empresaId')!;

    }


    onFileChange(event: any) {
        const file = event.target.files[0];
        this.selectedFile = file ?? null;
    }

    firmar() {
        if (!this.selectedFile || !this.empresaID) return;

        this.firmaService.firmarXML(this.selectedFile, this.empresaID).subscribe((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `firmado-${this.selectedFile!.name}`;
            a.click();
        });
    }





}

