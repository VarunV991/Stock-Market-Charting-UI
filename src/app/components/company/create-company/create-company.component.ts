import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/service/company.service';
import { SectorService } from 'src/app/service/sector.service';
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
  singleDropdownSettings:any;
  sectors;
  selectedSector:any[] = [];

  constructor(private companyService:CompanyService,
    private router:Router,
    private toastr:ToastrService,
    private sectorService:SectorService) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation.extras.replaceUrl === undefined){
      const state = navigation.extras.state;
      this.operationHeader = state.operationHeader;
      this.company = state.data;
      this.selectedSector = [this.company.sectorName];
      this.editOperation = state.editOperation;
    }
   }

  ngOnInit(): void {
    this.singleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true
    }
    this.getDropdownData();
  }

  getDropdownData(){
    this.sectorService.getSectors().subscribe(res=>{
      this.sectors = res;
    })
  }

  onSubmit({value, valid}: {value: CompanyDto, valid: boolean}) {
    if(this.selectedSector.length==0) valid=false;
    if(valid){
      this.company.sectorName = 
      (this.selectedSector[0].name == undefined) ? this.selectedSector[0] : this.selectedSector[0].name;
      if(this.editOperation){
        this.companyService.editCompany(this.company);
      }
      else{
        this.companyService.addCompany(this.company);
      }
    }
    else{
      this.toastr.error("Please fill all the entries!");
    }
  }

}
