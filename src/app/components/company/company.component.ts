import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/service/company.service';
import { CompanyDto } from '../../models/CompanyDto';
import { CompanyExchangeMappingDto } from '../../models/CompanyExchangeMappingDto';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { IpoDto } from 'src/app/models/IpoDto';
import { GridOptions } from 'ag-grid-community';
import { StockExchangeService } from 'src/app/service/stock-exchange.service';
import { StockPriceService } from 'src/app/service/stock-price.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  
  companyCode;
  exchanges:any[];
  selectedExchange:any[] = [];
  singleDropdownSettings

  ipos:IpoDto[] = []; 
  ipoDetailDisplay = 'none';

  flagForData:boolean = false;
  rowData:any[] = [];
  colDefs:any[] = [];
  defaultColDef;
  rowSelection;

  rowDataForStockData:any[] = [];
  colDefsForStockData:any[] = [];
  stockDataDisplay = 'none';
  flagForStockData:boolean = false;

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true}

  constructor(private companyService:CompanyService,
    private stockExchangeService:StockExchangeService,
    private stockPriceService:StockPriceService,
    private spinner:NgxSpinnerService,
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
    ];

    this.colDefsForStockData = [
      {field:'id',headerName:'Company Id',hide:true},
      {field:'companyCode',headerName:'Company Code',sortable:true,filter:true},
      {field:'stockExchangeName',headerName:'Exchange Name',sortable:true,filter:true},
      {field:'price',headerName:'Price',sortable:true,filter:true},
      {field:'date',headerName:'Date',sortable:true,filter:true},
      {field:'time',headerName:'Time',sortable:true,filter:true}
    ];

    this.rowSelection = 'single';
    this.defaultColDef = {
      minWidth:40,
      flex:1
    }
    this.singleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true
    }
    this.getDropdownData();
    this.viewCompanies();
  }

  getDropdownData(){
    this.spinner.show();
    this.stockExchangeService.getStockExchanges().subscribe(res=>{
      this.exchanges = [...res];
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.toastr.error(err.error,'',this.timeout);
    })
  }

  viewCompanies(){
    this.spinner.show();
    this.flagForData = true;
    this.companyService.getCompanies()
      .subscribe((response) => {
        this.rowData = [...response];
        if(this.rowData.length==0){
          this.flagForData = false;
        }
        this.spinner.hide();
      },err=>{
        this.spinner.hide();
        this.toastr.error(err.error,'',this.timeout);
        this.flagForData = false;
      });
  }

  addExchangeMapCode(){
    if(this.selectedExchange.length>0 && this.companyCode){
      let exchangeCode = {
        companyCode: this.companyCode,
        exchangeName: this.selectedExchange[0].name
      }
      this.codeMappings = [exchangeCode];
      this.uploadExchangeMappings();
    }
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
          name:'Get Stock Price Data',
          context:params.context,
          action: () => {
            params.context.getStockData(selectedRow[0].name);
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
    this.spinner.show();
    this.companyService.getCompanyIpoDetails(name).subscribe(response => {
      this.ipos = [response];
      this.ipoDetailDisplay = 'block';
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();
      this.toastr.error(err.error,'',this.timeout);
    })
  }

  getStockData(name){
    this.spinner.show();
    this.companyName = name;
    this.stockPriceService.getStockPriceDataForCompany(name).subscribe(res=>{
      if(res.length>0){
        this.rowDataForStockData = [...res];
        this.flagForStockData = true;
      }
      else{
        this.flagForStockData = false;
      }
      this.stockDataDisplay = 'block';
      this.spinner.hide();
    },err=>{
      this.stockDataDisplay = 'none';
      this.spinner.hide();
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
    this.selectedExchange = [];
    this.companyCode = null;
    this.codeMap = null;
    this.codeMappings = [];
    this.file = null;
    this.companyName = null;
    this.exchangeCodeMappingDisplay = 'none';
    this.inputFileName = "Choose File";
  }

  closeModal(){
    this.ipoDetailDisplay = 'none';
    this.stockDataDisplay = 'none';
    this.ipos = [];
    this.reset();
  }

}
