import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {StepsModule} from 'primeng/steps';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {DialogModule} from 'primeng/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PanelModule} from 'primeng/panel';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {MultiSelectModule} from 'primeng/multiselect';
import {FileUploadModule} from 'primeng/fileupload';
import {VirtualScrollerModule} from 'primeng/virtualscroller';

const primengModules = [
  ToolbarModule,
  CardModule,
  ButtonModule,
  StepsModule,
  CheckboxModule,
  DropdownModule,
  TieredMenuModule,
  DialogModule,
  ProgressSpinnerModule,
  PanelModule,
  InputTextareaModule,
  TableModule,
  PaginatorModule,
  MultiSelectModule,
  FileUploadModule,
  VirtualScrollerModule
];

@NgModule({
  imports: [
    CommonModule,
    ...primengModules
  ],
  exports: primengModules
})
export class PrimengModule { }