import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { CreateCompanyComponent } from './components/company/create-company/create-company.component';
import { ComparisionTabComponent } from './components/comparision-tab/comparision-tab.component';
import { HomeComponent } from './components/home/home.component';
import { ImportExcelComponent } from './components/import-excel/import-excel.component';
import { CreateIpoComponent } from './components/ipo/create-ipo/create-ipo.component';
import { IpoComponent } from './components/ipo/ipo.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { CreateStockExchangeComponent } from './components/stock-exchange/create-stock-exchange/create-stock-exchange.component';
import { StockExchangeComponent } from './components/stock-exchange/stock-exchange.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'import-excel',component: ImportExcelComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'companies', component: CompanyComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'create-company', component: CreateCompanyComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'edit-company', component: CreateCompanyComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'stock-exchanges', component: StockExchangeComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'create-stock-exchange', component: CreateStockExchangeComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'edit-stock-exchange', component: CreateStockExchangeComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'ipos', component: IpoComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN','ROLE_USER']}},
  {path: 'create-ipo', component: CreateIpoComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'edit-ipo', component: CreateIpoComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN']}},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'compare',component:ComparisionTabComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN','ROLE_USER']}},
  {path: 'profile',component:ProfileComponent,canActivate:[AuthGuard],data:{roles: ['ROLE_ADMIN','ROLE_USER']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
