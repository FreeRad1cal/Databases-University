import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignedInGuard } from './auth/services/signed-in-guard.service';
import { HomeComponent } from './containers/home/home.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: '',
    component: HomeComponent, 
    canActivate: [SignedInGuard],
    children: [
      {
        path: 'academics',
        loadChildren: './academics/academics.module#AcademicsModule'
      },
      {
        path: 'personnel',
        loadChildren: './personnel/personnel.module#PersonnelModule'
      }
    ]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
