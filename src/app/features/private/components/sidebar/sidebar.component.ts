import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
export class SidebarComponent implements OnInit {
    yearActual = new Date().getFullYear();
    filteredSidebarMenu = [
        {
            name: 'Dashboard',
            icon: 'bi-graph-up',
            iconColor: '#4ade80', // verde menta
            route: '/dashboard',
            subtitle: 'Resumen general'
        },
        {
            name: 'Datos e-CF (2)',
            icon: 'bi-file-earmark-text',
            iconColor: '#38bdf8', // azul claro
            route: '/certificaciones',
            subtitle: 'Pruebas de datos e-CF'
        },
        {
            name: 'Aprobación Comercial (3)',
            icon: 'bi-check2-square',
            iconColor: '#60a5fa', // azul más oscuro
            route: '/aceecf',
            subtitle: 'Pruebas con DGII'
        },
        {
            name: 'Simular e-CF (4)',
            icon: 'bi-cpu',
            iconColor: '#facc15', // amarillo
            route: '/simulacion',
            subtitle: 'Simulación DGII'
        },
        {
            name: 'Usuarios',
            icon: 'bi-person-lines-fill',
            iconColor: '#a78bfa', // violeta
            route: '/users',
            roles: ['Admin'],
            subtitle: 'Gestión de usuarios'
        },
        {
            name: 'Firmar XML',
            icon: 'bi-shield-lock',
            iconColor: '#fb923c', // naranja
            route: '/firma',
            subtitle: 'App firma digital'
        },
        {
            name: 'Ajustes',
            icon: 'bi-sliders',
            iconColor: '#94a3b8', // gris claro
            route: '/settings',
            subtitle: 'Configuración general'
        }
    ];





    currentRoute = '';

    userRole = localStorage.getItem('role') || '';

    get visibleSidebarMenu() {
        return this.filteredSidebarMenu.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(this.userRole);
        });
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.currentRoute = event.urlAfterRedirects.replace('/private', '');
            }
        });
    }

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
