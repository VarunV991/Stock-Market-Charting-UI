import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/service/company.service';
import { CompanyDto } from '../../models/CompanyDto';
import { CompanyExchangeMappingDto } from '../../models/CompanyExchangeMappingDto';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { IpoDto } from 'src/app/models/IpoDto';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  file: File;
  arrayBuffer: any;
  fileList: any;
  inputFileName: string = "Choose File";
  codeMappings: CompanyExchangeMappingDto[] = [];
  codeMap: CompanyExchangeMappingDto;
  exchangeCodeMappingDisplay = 'none';
  companyName:string;

  ipos:IpoDto[] = []; 
  ipoDetailDisplay = 'none';

  flagForData:boolean = false;
  rowData:any[] = [];
  colDefs:any[] = [];
  defaultColDef;
  rowSelection;

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true}

  constructor(private companyService:CompanyService,
    private router:Router,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.colDefs = [
      {field:'id',headerName:'Company Id',hide:true},
      {field:'name',headerName:'Company Name',sortable:true,filter:true,tooltipField:'name',
        lockPosition:true, suppressColumnsToolPanel:true,headerCheckboxSelectionFilteredOnly:true,
        checkboxSelection:true},
      {field:'turnover',headerName:'Turnover',sortable:true,filter:true},
      {field:'ceo',headerName:'Ceo',sortable:true,filter:true},
      {field:'boardOfDirectors',headerName:'Board Of Directors',sortable:true,filter:true,tooltipField:'boardOfDirectors'},
      {field:'exchanges',headerName:'Listed Exchanges',sortable:true,filter:true},
      {field:'sectorName',headerName:'Sector',sortable:true,filter:true},
      {field:'description',headerName:'Description',sortable:true,filter:true,tooltipField:'description'},
    ]
    this.rowSelection = 'single';
    this.defaultColDef = {
      minWidth:40,
      flex:1
    }
    this.viewCompanies();
  }

  viewCompanies(){
    this.companyService.getCompanies()
      .subscribe((response) => {
        this.rowData = [...response];
        if(this.rowData.length>0){
          this.flagForData = true;
        }
      });
  }

  public gridOptions :GridOptions = {
    getContextMenuItems: this.getContextMenuItems,
    context:this
  }

  getContextMenuItems(params){
    var selectedRow = params.api.getSelectedRows();
    if(selectedRow.length>0){
      const result = [
        {
          name:'Map Exchange Codes',
          context:params.context,
          action: () => {
            params.context.openExchangeCodeMapping(selectedRow[0].name);
          }
        },
        {
          name:'Get Ipo Details',
          context:params.context,
          action: () => {
            params.context.getIpoDetails(selectedRow[0].name);
          }
        },
        {
          name:'Edit',
          context:params.context,
          action: () => {
            params.context.onEditClick(selectedRow);
          }
        },
        {
          name:'Delete',
          context:params.context,
          action: () => {
            params.context.onDeleteClick(selectedRow[0].id);
          }
        },
        'copyWithHeaders',
        {
          name: 'Excel Export (.xlsx)',
          action: () => {
            params.api.exportDataAsExcel();
          }
        },
        {
          name: 'CSV Export (.csv)',
          action: () => {
            params.api.exportDataAsCsv();
          }
        }
      ]
      return result;
    }
    else{
      const result1 = [
        'copyWithHeaders',
        {
          name: 'Excel Export (.xlsx)',
          action: () => {
            params.api.exportDataAsExcel();
          }
        },
        {
          name: 'CSV Export (.csv)',
          action: () => {
            params.api.exportDataAsCsv();
          }
        }
      ]
      return result1;
    }
  }

  onEditClick(selectedRow){
    let company = new CompanyDto();
    company.id = selectedRow[0].id;
    company.name = selectedRow[0].name;
    company.turnover = selectedRow[0].turnover;
    company.ceo = selectedRow[0].ceo;
    company.boardOfDirectors = selectedRow[0].boardOfDirectors;
    company.description = selectedRow[0].description;
    company.sectorName = selectedRow[0].sectorName;
    company.exchanges = selectedRow[0].exchanges;
    company.exchangeCode = selectedRow[0].exchangeCode;
    this.router.navigate(['/edit-company'],{state:{
      data:company,
      operationHeader:"Edit Company",
      editOperation:true
    }})
  }

  onDeleteClick(id: string) {
    this.companyService.deleteCompany(id).subscribe(res => {
      this.toastr.success(res);
      this.flagForData = false;
      this.viewCompanies();
    },err =>{
      this.toastr.error(err.text,'',this.timeout);
    });
  }

  getIpoDetails(name){
    this.companyName = name;
    this.ipoDetailDisplay = 'block';
    this.companyService.getCompanyIpoDetails(name).subscribe(response => {
      this.ipos = [response];
    },
    err=>{
      console.log(err);
      this.toastr.error(err.error,'',this.timeout);
    })
  }

  openExchangeCodeMapping(name){
    this.exchangeCodeMappingDisplay = 'block';
    this.companyName = name;
  }

  onUpload(event) {
    this.file = event.target.files[0];
    this.inputFileName = event.target.files[0].name;
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var records = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      records.filter(record => {
        this.codeMap = {
          companyCode: record["Company Code"],
          exchangeName: record["Stock Exchange"]
        }
        this.codeMappings.push(this.codeMap);
      });
    }
    event.target.value = null;
  }

  uploadExchangeMappings(){
    if(this.codeMappings.length == 0){
      this.toastr.error("The uploaded file is empty.",'',this.timeout);
    }
    else{
      this.companyService.mapCompanyExchangeCode(this.companyName,this.codeMappings)
      .subscribe((responseData) => {
        this.toastr.success(responseData);
        this.reset();
        this.viewCompanies();
      },
      err=>{
        this.toastr.error(err.error,'',this.timeout);
        this.reset();
      });
    }
  }

  reset(){
    this.codeMap = null;
    this.codeMappings = [];
    this.file = null;
    this.companyName = null;
    this.exchangeCodeMappingDisplay = 'none';
    this.inputFileName = "Choose File";
  }

  closeModal(){
    this.exchangeCodeMappingDisplay = 'none';
    this.ipoDetailDisplay = 'none';
    this.companyName = null;
    this.ipos = [];
    this.reset();
  }

}