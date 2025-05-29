import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { AceecfPage } from "./aceecf.page";
import { AceecfPageRoutingModule } from "./aceecf.page-routing.module";




@NgModule({
    imports: [
        AceecfPageRoutingModule,
        PrivateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        AceecfPage,
    ],

})

export class AceecfPageModule { }
