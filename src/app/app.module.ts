import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
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
import { SectorComponent } from './components/sector/sector.component';
import { CreateSectorComponent } from './components/sector/create-sector/create-sector.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ComparisionComponent } from './components/comparision-tab/comparision/comparision.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise'; 
import {Chart} from 'chart.js';
import { ComparisionTabComponent } from './components/comparision-tab/comparision-tab.component';
import { ComparisionSectorsComponent } from './components/comparision-tab/comparision-sectors/comparision-sectors.component';
import { ComparisionCompSectorComponent } from './components/comparision-tab/comparision-comp-sector/comparision-comp-sector.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ImportExcelComponent,
    CompanyComponent,
    CreateCompanyComponent,
    StockExchangeComponent,
    CreateStockExchangeComponent,
    IpoComponent,
    CreateIpoComponent,
    SectorComponent,
    CreateSectorComponent,
    LoginComponent,
    SignupComponent,
    ComparisionComponent,
    ComparisionTabComponent,
    ComparisionSectorsComponent,
    ComparisionCompSectorComponent
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
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

