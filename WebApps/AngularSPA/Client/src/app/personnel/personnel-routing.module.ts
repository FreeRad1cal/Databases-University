import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobSearchPageComponent } from './containers/job-search-page/job-search-page.component';
import { JobPostingComponent } from './containers/job-posting/job-posting.component';
import { JobApplicationPageComponent } from './containers/job-application-page/job-application-page.component';
import { JobApplicationConfirmationComponent } from './containers/job-application-confirmation/job-application-confirmation.component';
import { MyJobApplicationsComponent } from './containers/my-job-applications/my-job-applications.component';
import { JobApplicationsComponent } from './containers/job-applications/job-applications.component';

const personnelRoutes: Routes = [
    {
        path: 'employment',
        children: [
            {
                path: 'apply/confirmation',
                component: JobApplicationConfirmationComponent
            },
            {
                path: 'job-posting/:id',
                component: JobPostingComponent
            },
            {
                path: 'apply/:id',
                component: JobApplicationPageComponent
            },
            {
                path: 'my-job-applications',
                component: MyJobApplicationsComponent
            },
            {
                path: 'job-applications',
                component: JobApplicationsComponent
            },
            {
                path: 'job-search',
                component: JobSearchPageComponent
            },
            {
                path: '',
                redirectTo: 'job-search',
                pathMatch: 'full'
            }
        ]
    }
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