import { Component, ElementRef, OnInit} from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { ToastrService } from 'ngx-toastr';
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
  periodicityList:any[] = ['Day','Week','Month','Quarter'];
  colors:any[] = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)'
];

  holidayList:any[] = [
    "2021-01-26",
    "2021-03-11",
    "2021-03-29",
    "2021-04-02",
    "2021-04-14",
    "2021-04-21"
  ];
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
  canvas:any;
  ctx:any;

  constructor(private companyService:CompanyService,
    private stockExchangeService:StockExchangeService,
    private comparisionService:ComparisionService,
    private toastr:ToastrService, 
    private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.multiDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection:4
    };

    this.singleDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true
    }
    this.getDropdownData();
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

  async onSubmit(){
    if(this.selectedExchange.length!=0 && this.fromPeriod && this.toPeriod && this.selectedPeriod.length!=0){
      if(this.selectedCompanies.length!=0){
        let dataObjs = [];
        let labels = this.generateDateRange();
        let fetchList = new Promise<void>((resolve) => {
          this.selectedCompanies.forEach(async (company,index,array) => {
            await this.comparisionService.getStockPricesForCompany(company.id,this.selectedExchange[0].name,
              this.fromPeriod,this.toPeriod,this.selectedPeriod[0]).toPromise().then((response)=>{
                let prices = [];
                if(Object.keys(response).length>0){
                  let stockDates = Object.keys(response);
                  labels.forEach((label,index)=>{
                    if(stockDates.includes(label)){
                      prices.push(response[label].toFixed(2));
                    }
                    else{
                      prices.push(undefined);
                    }
                  })
                }
                let dataObj = {
                  label: company.name,
                  data: prices,
                  borderColor: this.colors[index],
                  fill:false
                }
                dataObjs.push(dataObj);
              })
              if(index===array.length-1){
                resolve();
              }
          });
        });
        fetchList.then(()=>{ 
          setTimeout(()=> {
            if(this.elementRef.nativeElement.querySelector("#canvasId")!=undefined)
            this.elementRef.nativeElement.querySelector("#canvasId").remove();
            this.elementRef.nativeElement.querySelector("#canvasContainer").insertAdjacentHTML('afterbegin',
            '<canvas id="canvasId" width="400px" height="400px"></canvas>');
            this.canvas = this.elementRef.nativeElement.querySelector("#canvasId");
            this.ctx = this.canvas.getContext("2d");
            let canvasId = new Chart(this.ctx,{
              type:'line',
              data: {
                labels: labels,
                datasets: dataObjs.slice()
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Date'
                    }
                  }],
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Stock Price (in Rupees)'
                    }
                  }],
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Company Comparision'
                  }
                }
              },
            });
          },400)
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
    if(period == 'Day' || period == 'Week'){
      let days = (period == 'Day')? 1 : 7;
      for(fromDate;fromDate<toDate;fromDate.setDate(fromDate.getDate()+days)){
        let curDate = new Date(fromDate);
        let dayOfWeek = curDate.getDay();
        if(dayOfWeek!=0 && dayOfWeek!=6 && !this.holidayList.includes(curDate.toISOString().slice(0,10))){
          dateRange.push(curDate);
        }
      }
    }
    else if(period == 'Month' || period == 'Quarter'){
      let month = (period == 'Month')? 1 : 3;
      for(fromDate;fromDate<toDate;fromDate.setMonth(fromDate.getMonth()+month)){
        let curDate = new Date(fromDate);
        let dayOfWeek = curDate.getDay();
        if(dayOfWeek==0)
          curDate.setDate(curDate.getDate()+1);
        else if(dayOfWeek==6)
          curDate.setDate(curDate.getDate()-1);

        if(this.holidayList.includes(curDate.toISOString().slice(0,10))){
          curDate.setDate(curDate.getDate()+1);
        }
        dateRange.push(curDate);
      }
    }
    dateRange.push(toDate);
    dateRange = dateRange.map((v)=>v.toISOString().slice(0,10));
    return dateRange;
  }

  reset(){
    this.selectedCompanies = [];
    this.selectedExchange = [];
    this.selectedPeriod = [];
    this.fromPeriod = null;
    this.toPeriod = null;
  }

}
