import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjToKeysPipe } from './pipes/ObjToKeysPipe';

@NgModule({
  declarations: [ObjToKeysPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [CommonModule, ReactiveFormsModule, ObjToKeysPipe]
})
export class SharedModule { }
