import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {StepsModule} from 'primeng/steps';
import {CheckboxModule} from 'primeng/checkbox';

const primengModules = [
  ToolbarModule,
  CardModule,
  ButtonModule,
  StepsModule,
  CheckboxModule
];

@NgModule({
  imports: [
    CommonModule,
    ...primengModules
  ],
  exports: primengModules
})
export class PrimengModule { }