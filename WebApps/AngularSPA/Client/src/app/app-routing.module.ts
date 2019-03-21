import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignedInGuard } from './auth/services/signed-in-guard.service';
import { HomeComponent } from './containers/home/home.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home', 
    component: HomeComponent, 
    canActivate: [SignedInGuard]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true
    }),
    // StoreRouterConnectingModule.forRoot({
    //   stateKey: 'router'
    // })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
