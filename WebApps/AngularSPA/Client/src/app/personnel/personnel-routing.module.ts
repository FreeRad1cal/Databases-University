import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { JobSearchPageComponent } from './containers/job-search-page/job-search-page.component';
import { JobSearchComponent } from './containers/job-search/job-search.component';
import { JobPostingComponent } from './containers/job-posting/job-posting.component';

const personnelRoutes: Routes = [
    {
        path: 'job-search',
        component: JobSearchComponent,
        children: [
            {
                path: 'posting/:id',
                component: JobPostingComponent
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