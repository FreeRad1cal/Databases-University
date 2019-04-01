import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplyPageComponent } from './containers/apply-page/apply-page.component';

const academicsRoutes: Routes = [
    {
        path: 'apply',
        component: ApplyPageComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(academicsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AcademicsRoutingModule {}