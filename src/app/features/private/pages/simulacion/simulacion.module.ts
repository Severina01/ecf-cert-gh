import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { SimulacionPage } from "./simulacion.page";
import { SimulacionPageRoutingModule } from "./simulacion.page-routing.module";
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
    imports: [
        SimulacionPageRoutingModule,
        PrivateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        QRCodeModule
    ],
    declarations: [
        SimulacionPage,
    ],

})

export class SimulacionPageModule { }
