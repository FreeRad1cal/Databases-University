import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplicationPageComponent } from './containers/application-page/application-page.component';

const academicsRoutes: Routes = [
    {
        path: 'apply',
        component: ApplicationPageComponent
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