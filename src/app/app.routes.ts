import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ListarEmpresasComponent } from './pages/listar-empresas/listar-empresas.component';
import { AuthGuard } from './auth.guard';
import { EmpresaDetalhesComponent } from './pages/empresa-detalhes/empresa-detalhes.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'login', component: LoginComponent },
  {
    path: 'listar-empresas',
    component: ListarEmpresasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'empresa/:id',
    component: EmpresaDetalhesComponent,
    canActivate: [AuthGuard],
  },
];
