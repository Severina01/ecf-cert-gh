import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from 'src/app/core/services/icons/icons.service';


export interface SidebarMenuItem {
    name: string;
    icon: SafeHtml;
    route: string;
}

export interface SidebarMenuSection {
    title: string;
    items: SidebarMenuItem[];
}


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    yearActual = new Date().getFullYear();
    filteredSidebarMenu = [
        {
            name: 'Dashboard',
            icon: 'bi-columns-gap',
            route: '/dashboard',
        },
        {
            name: 'XLSX ECF (2)',
            icon: 'bi-receipt',
            route: '/certificaciones',
        },
        {
            name: 'XLSX ACEECF (3)',
            icon: 'bi-receipt',
            route: '/aceecf',
        },
        {
            name: 'Simulacion (4)',
            icon: 'bi-laptop',
            route: '/simulacion',
        },
        {
            name: 'Usuarios',
            icon: 'bi-people',
            route: '/users',
        },
        {
            name: 'Firma XML',
            icon: 'bi-filetype-xml',
            route: '/firma',
        },
        {
            name: 'Configuracion',
            icon: 'bi-gear',
            route: '/settings',

        },
        // {
        //   name: 'Procedimientos',
        //   icon: 'bi-journal-medical',
        //   route: '/consultas',

        // },


    ];

    constructor(private router: Router, private sidebarService: SidebarService, private iconService: IconService, private sanitizer: DomSanitizer) {


    }

    // Método para verificar si una ruta está activa
    isRouteActive(route: string): boolean {
        return this.router.isActive(route, true);
    }


    closeSidebar(): void {
        this.sidebarService.toggleSidebar(false);
    }

    getSanitizedIcon(name: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.iconService.getIcon(name));
    }
}