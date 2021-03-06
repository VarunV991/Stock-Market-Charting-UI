import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ImportExcelComponent } from './components/import-excel/import-excel.component';
import { CompanyComponent } from './components/company/company.component';
import { CreateCompanyComponent } from './components/company/create-company/create-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StockExchangeComponent } from './components/stock-exchange/stock-exchange.component';
import { CreateStockExchangeComponent } from './components/stock-exchange/create-stock-exchange/create-stock-exchange.component';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IpoComponent } from './components/ipo/ipo.component';
import { CreateIpoComponent } from './components/ipo/create-ipo/create-ipo.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ComparisionComponent } from './components/comparision-tab/comparision/comparision.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise'; 
import {Chart} from 'chart.js';
import { ComparisionTabComponent } from './components/comparision-tab/comparision-tab.component';
import { ComparisionSectorsComponent } from './components/comparision-tab/comparision-sectors/comparision-sectors.component';
import { ComparisionCompSectorComponent } from './components/comparision-tab/comparision-comp-sector/comparision-comp-sector.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImportExcelComponent,
    CompanyComponent,
    CreateCompanyComponent,
    StockExchangeComponent,
    CreateStockExchangeComponent,
    IpoComponent,
    CreateIpoComponent,
    LoginComponent,
    SignupComponent,
    ComparisionComponent,
    ComparisionTabComponent,
    ComparisionSectorsComponent,
    ComparisionCompSectorComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({timeOut: 3000, preventDuplicates:true}),
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([]),
    NgxSpinnerModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

