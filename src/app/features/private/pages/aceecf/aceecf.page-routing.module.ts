import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AceecfPage } from './aceecf.page';

const routes: Routes = [
    {
        path: '',
        component: AceecfPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AceecfPageRoutingModule { } 
