import { NgModule } from "@angular/core";
import { PrivateModule } from "../../private.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { SettingPage } from "./setting.page";
import { SettingPageRoutingModule } from "./setting.page-routing.module";




@NgModule({
    imports: [
        SettingPageRoutingModule,
        PrivateModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        SettingPage,
    ],

})

export class SettingPageModule { }
