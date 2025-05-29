import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulacionPage } from './simulacion.page';

const routes: Routes = [
    {
        path: '',
        component: SimulacionPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SimulacionPageRoutingModule { } 
