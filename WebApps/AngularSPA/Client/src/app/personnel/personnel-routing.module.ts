import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobSearchPageComponent } from './containers/job-search-page/job-search-page.component';
import { JobPostingComponent } from './containers/job-posting/job-posting.component';
import { JobApplicationPageComponent } from './containers/job-application-page/job-application-page.component';

const personnelRoutes: Routes = [
    {
        path: 'job-search',
        children: [
            {
                path: 'posting/:id',
                component: JobPostingComponent
            },
            {
                path: 'apply/:id',
                component: JobApplicationPageComponent
            },
            {
                path: '',
                component: JobSearchPageComponent
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(personnelRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PersonnelRoutingModule {}