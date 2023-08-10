import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cage',
    loadChildren: () => import('./features/cage/cage.module').then( m => m.CageModule)
  },
  {
    path: 'flock',
    loadChildren: () => import('./features/flock/flock.module').then( m => m.FlockModule)
  },
  {
    path: 'survey',
    loadChildren: () => import('./features/survey/survey.module').then( m => m.SurveyModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
