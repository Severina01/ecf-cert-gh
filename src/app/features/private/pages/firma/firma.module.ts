import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { FirmaPage } from "./firma.page";
import { FirmaPageRoutingModule } from "./firma.page-routing.module";




@NgModule({
    imports: [
        FirmaPageRoutingModule,
        PrivateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        FirmaPage,
    ],

})

export class FirmaPageModule { }
