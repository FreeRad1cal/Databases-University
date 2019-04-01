import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ObjToKeysPipe } from './pipes/ObjToKeysPipe';

@NgModule({
  declarations: [ObjToKeysPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, ObjToKeysPipe]
})
export class SharedModule { }
