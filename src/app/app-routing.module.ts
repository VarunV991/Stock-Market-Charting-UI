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
import { SignupComponent } from './components/signup/signup.component';
import { CreateStockExchangeComponent } from './components/stock-exchange/create-stock-exchange/create-stock-exchange.component';
import { StockExchangeComponent } from './components/stock-exchange/stock-exchange.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'import-excel',component: ImportExcelComponent},
  {path: 'companies', component: CompanyComponent},
  {path: 'create-company', component: CreateCompanyComponent},
  {path: 'edit-company', component: CreateCompanyComponent},
  {path: 'stock-exchanges', component: StockExchangeComponent},
  {path: 'create-stock-exchange', component: CreateStockExchangeComponent},
  {path: 'edit-stock-exchange', component: CreateStockExchangeComponent},
  {path: 'ipos', component: IpoComponent},
  {path: 'create-ipo', component: CreateIpoComponent},
  {path: 'edit-ipo', component: CreateIpoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'compare',component:ComparisionTabComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
