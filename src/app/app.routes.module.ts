import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './components/home.component/home.component';
import { SaisieComponent } from './modules/saisie.module/saisie.component';
import { NouvelleSaisieComponent } from './modules/saisie.module/nouvelle-saisie.component/nouvelle-saisie.component';
import { GestionSaisieComponent } from './modules/saisie.module/gestion-saisie.component/gestion-saisie.component';
import { LoginComponent } from './components/authentication.component/login.component';
import { PageNotFoundComponent } from './components/page-not-found.component/page-not-found.component';
import { VisualisationSyntheseComponent } from './modules/synthese.module/visualisation-synthese.component/visualisation-synthese.component';
import { ImportSaisieComponent } from './modules/saisie.module/import-saisie.component/import-saisie.component';
import { GestionParametrageComponent } from './modules/parametrage.module/gestion-parametrage.component/gestion-parametrage.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'synthese',
    component: VisualisationSyntheseComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'saisie',
    component: SaisieComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'nouvelle',
        component: NouvelleSaisieComponent
      },
      {
        path: 'import',
        component: ImportSaisieComponent
      },
      {
        path: 'gestion',
        component: GestionSaisieComponent
      }
    ]
  },
  { path: 'parametrage', component: GestionParametrageComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

export let AppRoutesModule = RouterModule.forRoot(routes);
