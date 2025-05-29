import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { CertPage } from "./cert.page";
import { CertPageRoutingModule } from "./cert.page-routing.module";




@NgModule({
    imports: [
        CertPageRoutingModule,
        PrivateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        CertPage,
    ],

})

export class CertPageModule { }
