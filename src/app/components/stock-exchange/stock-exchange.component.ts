import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StockExchangeService } from 'src/app/service/stock-exchange.service';
import { CompanyDto } from '../../models/CompanyDto';
import { StockExchangeDto } from '../../models/StockExchangeDto';

@Component({
  selector: 'app-stock-exchange',
  templateUrl: './stock-exchange.component.html',
  styleUrls: ['./stock-exchange.component.css']
})
export class StockExchangeComponent implements OnInit {

  companies:CompanyDto[];
  companyListDisplay = 'none';

  flagForData:boolean = false;
  rowData:any[] = [];
  colDefs:any[] = [];
  defaultColDef;
  rowSelection;

  constructor(private stockExchangeService:StockExchangeService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.colDefs = [
      {field:'id',headerName:'Exchange Id',hide:true},
      {field:'name',headerName:'Company Name',sortable:true,filter:true,tooltipField:'name',
        lockPosition:true, suppressColumnsToolPanel:true,headerCheckboxSelectionFilteredOnly:true,
        checkboxSelection:true},
      {field:'description',headerName:'Description',sortable:true,filter:true,tooltipField:'description'},
      {field:'address',headerName:'Address',sortable:true,filter:true,tooltipField:'address'},
      {field:'remarks',headerName:'Remarks',sortable:true,filter:true,tooltipField:'remarks'},
    ]
    this.rowSelection = 'single';
    this.defaultColDef = {
      minWidth:40,
      flex:1
    }
    this.viewStockExchanges();
  }

  viewStockExchanges(){
    this.spinner.show();
    this.flagForData = true;
    this.stockExchangeService.getStockExchanges().subscribe(response => {
      this.rowData = response;
      if(this.rowData.length==0){
        this.flagForData = false;
      }
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.flagForData = false;
      this.toastr.error(err.error);
    })
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
          name:'Get Companies',
          context:params.context,
          action: () => {
            params.context.onGetCompanies(selectedRow[0].name);
          }
        },
        {
          name:'Edit',
          context:params.context,
          action: () => {
            params.context.onEditClick(selectedRow);
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
    let stockExchange = new StockExchangeDto();
    stockExchange.id = selectedRow[0].id;
    stockExchange.name = selectedRow[0].name;
    stockExchange.description = selectedRow[0].description;
    stockExchange.address = selectedRow[0].address;
    stockExchange.remarks = selectedRow[0].remarks;
    this.router.navigate(['edit-stock-exchange'],{state:{
      stockExchange:stockExchange,
      operationHeader:"Edit Stock Exchange",
      editOperation:true
    }})
  }

  onGetCompanies(name){
    this.spinner.show();
    this.stockExchangeService.getCompaniesinExchange(name).subscribe(response => {
      this.companies = response;
      this.companyListDisplay = 'block';
      this.spinner.hide();
    },err=>{
      this.companyListDisplay = 'none';
      this.spinner.hide();
    });
  }

  closeModal(){
    this.companyListDisplay = 'none';
    this.companies = [];
  }

}
