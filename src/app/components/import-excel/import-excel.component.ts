import { Component, OnInit } from '@angular/core';
import { StockPriceDto } from '../../models/StockPriceDto';
import * as XLSX from 'xlsx';
import { StockPriceService } from 'src/app/service/stock-price.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent implements OnInit {

  file: File;
  arrayBuffer: any;
  fileList: any;
  numberOfRecords: number;
  stockPrices: StockPriceDto[] = [];
  stockPrice: StockPriceDto;
  isUploaded: boolean = false;
  companyCode: string;
  stockExchangeName: string;
  fromDate: string;
  toDate: string;
  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true}
  inputFileName:string = "Choose File";

  constructor(private stockPriceService:StockPriceService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onUpload(event) {
    this.file= event.target.files[0];
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
      this.numberOfRecords = records.length;
      console.log(this.numberOfRecords);
      records.filter(record => {
        this.stockPrice = {
          companyCode: record["Company Code"],
          stockExchangeName: record["Stock Exchange"],
          price: record["Price Per Share(in Rs)"],
          date: record["Date"].trim(),
          time: record["Time"].trim()
        }
        this.stockPrices.push(this.stockPrice);
      });
      console.log(this.stockPrices);
    }
    event.target.value = null;
  }

  uploadData(){
    this.stockPriceService.addStockPriceList(this.stockPrices).subscribe(response=>{
        this.companyCode = this.stockPrices[0].companyCode;
        this.stockExchangeName = this.stockPrices[0].stockExchangeName;
        this.fromDate = this.stockPrices[0].date;
        this.toDate = this.stockPrices[this.numberOfRecords-1].date;
        this.isUploaded = true;
        this.reset();
    },
    err=>{
      this.toastr.error(err.error,'',this.timeout);
      this.reset();
    });
  }

  importAgain() {
    this.isUploaded = false;
  }

  reset(){
    this.stockPrice = null;
    this.stockPrices = [];
    this.file = null;
    this.inputFileName = "Choose File";
  }

}
