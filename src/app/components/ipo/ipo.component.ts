import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { IpoService } from 'src/app/service/ipo.service';
import { TokenStorageService } from '../../security/token-storage.service';
import { IpoDto } from '../../models/IpoDto';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ipo',
  templateUrl: './ipo.component.html',
  styleUrls: ['./ipo.component.css']
})
export class IpoComponent implements OnInit {

  flagForData:boolean = false;
  rowData:any[] = [];
  colDefs:any[] = [];
  defaultColDef;
  rowSelection;
  flagForAdmin:boolean = false;

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true};

  constructor(private ipoService:IpoService,
    private router:Router,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService,
    private tokenStorageService:TokenStorageService) { }

  ngOnInit(): void {
    this.colDefs = [
      {field:'id',headerName:'Ipo Id',hide:true},
      {field:'companyName',headerName:'Company Name',sortable:true,filter:true,tooltipField:'name',
        lockPosition:true, suppressColumnsToolPanel:true,headerCheckboxSelectionFilteredOnly:true,
        checkboxSelection:true},
      {field:'exchangeName',headerName:'Exchange Name',sortable:true,filter:true},
      {field:'pricePerShare',headerName:'Price Per Share',sortable:true,filter:true},
      {field:'totalShares',headerName:'Total Shares',sortable:true,filter:true},
      {field:'openDateTime',headerName:'Open Date Time',sortable:true,filter:true},
      {field:'remarks',headerName:'Remarks',sortable:true,filter:true,tooltipField:'remarks'},
    ]
    this.rowSelection = 'single';
    this.defaultColDef = {
      minWidth:40,
      flex:1
    }
    this.flagForAdmin = (this.tokenStorageService.getUser().role == 'ROLE_ADMIN') ? true : false;
    this.viewIpos();
  }

  viewIpos(){
    this.spinner.show();
    this.flagForData=true;
    this.ipoService.getIpos().subscribe(response => {
      this.rowData = [...response];
      if(this.rowData.length==0){
        this.flagForData = false;
      }
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.toastr.error(err.error,'',this.timeout);
    })
  }

  public gridOptions :GridOptions = {
    getContextMenuItems: this.getContextMenuItems,
    context:this
  }

  getContextMenuItems(params){
    var selectedRow = params.api.getSelectedRows();
    if(selectedRow.length>0 && params.context.flagForAdmin){
      const result = [
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
    let ipo = new IpoDto;
    ipo.id = selectedRow[0].id;
    ipo.companyName = selectedRow[0].companyName;
    ipo.exchangeName = selectedRow[0].exchangeName;
    ipo.pricePerShare = selectedRow[0].pricePerShare;
    ipo.totalShares = selectedRow[0].totalShares;
    ipo.openDateTime = selectedRow[0].openDateTime;
    ipo.remarks = selectedRow[0].remarks;
    this.router.navigate(['/edit-ipo'],{state:{
      ipo:ipo,
      operationHeader:"Edit Ipo",
      editOperation:true
    }})
  }

}
