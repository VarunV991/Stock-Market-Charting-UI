import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChartPlotDto } from 'src/app/models/ChartPlotDto';
import { CompanyService } from 'src/app/service/company.service';
import { ComparisionService } from 'src/app/service/comparision.service';
import { StockExchangeService } from 'src/app/service/stock-exchange.service';

@Component({
  selector: 'app-comparision',
  templateUrl: './comparision.component.html',
  styleUrls: ['./comparision.component.css']
})
export class ComparisionComponent implements OnInit {

  companies:any[];
  exchanges:any[];
  periodicityList:any[] = ['day','week','month','quarter'];

  selectedCompanies:any[] = [];
  selectedExchange:any[] = [];
  selectedPeriod:any[] = [];
  fromPeriod:string;
  toPeriod:string;
  periodicity:string;

  multiDropdownSettings:any;
  singleDropdownSettings:any;

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true}

  flagForChart:boolean = false;
  dataSource: any;
  dataSchema:any;
  type: string;
  width: string;
  height: string;

  constructor(private companyService:CompanyService,
    private stockExchangeService:StockExchangeService,
    private comparisionService:ComparisionService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.multiDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    this.singleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true
    }
    this.getDropdownData();

    this.type = "timeseries";
    this.width = "100%";
    this.height = "400";

    // This is the dataSource of the chart
    this.dataSource = {
      chart: {},
      caption: {
        text: "Company Stock Prices"
      },
      series: "Type",
      yaxis: [
        {
          plot: "Stock Price",
          title: "Stock Price",
        }
      ]
    };

    this.dataSchema = [
      {
      "name":"Date",
      "type":"date",
      "format":"%Y-%m-%d"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "price",
        "type": "number"
      }
    ]
  }

  getDropdownData(){
    this.companyService.getCompanies().subscribe(res => {
      this.companies = [...res];
      console.log(this.companies);
    },
    err=>{
      this.toastr.error(err.error,'',this.timeout);
    })

    this.stockExchangeService.getStockExchanges().subscribe(res => {
      this.exchanges = [...res];
    },err=>{
      this.toastr.error(err.error,'',this.timeout);
    })
  }

  onSubmit(){
    if(this.selectedExchange.length!=0 && this.fromPeriod && this.toPeriod && this.selectedPeriod.length!=0){
      if(this.selectedCompanies.length!=0){
        let data = [];
        this.selectedCompanies.forEach((company)=>{
          this.comparisionService.getStockPricesForCompany(company.id,this.selectedExchange[0].name,
            this.fromPeriod,this.toPeriod,this.selectedPeriod[0]).subscribe(response =>{
              if(response.length>0){
                response.forEach(res => {
                  data.push([res.date,company.name,res.price]);
                })
              }
            })
        });
      }
      else{
        this.toastr.error('Please select atleast one company!','',this.timeout);
      }
    }
    else{
      this.toastr.error('Please enter required fields!','',this.timeout);
    }
  }

  generateDateRange(){
    let dateRange = [];
    let fromDate = new Date(this.fromPeriod);
    let toDate = new Date(this.toPeriod);
    let period = this.selectedPeriod[0];
    if(period == 'day' || period == 'week'){
      let days = (period == 'day')? 1 : 7;
      for(fromDate;fromDate<toDate;fromDate.setDate(fromDate.getDate()+days)){
        dateRange.push(new Date(fromDate));
      }
    }
    else if(period == 'month' || period == 'quarter'){
      let month = (period == 'month')? 1 : 3;
      for(fromDate;fromDate<toDate;fromDate.setMonth(fromDate.getMonth()+month)){
        dateRange.push(new Date(fromDate));
      }
    }
    dateRange.push(toDate);
    dateRange = dateRange.map((v)=>v.toISOString().slice(0,10));
    console.log(dateRange);
  }

  reset(){
    this.selectedCompanies = [];
    this.selectedExchange = [];
    this.selectedPeriod = [];
    this.fromPeriod = null;
    this.toPeriod = null;
  }

}
