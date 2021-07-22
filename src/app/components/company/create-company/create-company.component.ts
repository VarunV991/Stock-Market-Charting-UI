import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/service/company.service';
import { CompanyDto } from '../../../models/CompanyDto';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {

  operationHeader = "Add Company";
  editOperation:boolean = false;
  company: CompanyDto = new CompanyDto();

  constructor(private companyService:CompanyService,private router:Router) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.replaceUrl === undefined){
      const state = navigation.extras.state;
      this.operationHeader = state.operationHeader;
      this.company = state.data;
      this.editOperation = state.editOperation;
    }
   }

  ngOnInit(): void {
  }

  onSubmit({value, valid}: {value: CompanyDto, valid: boolean}) {
    console.log(valid);
    console.log(this.company);
    if(valid){
      if(this.editOperation){
        this.companyService.editCompany(this.company);
      }
      else{
        this.companyService.addCompany(this.company);
      }
    }
  }

}
