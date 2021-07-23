import { Component, ElementRef, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/service/company.service';
import { ComparisionService } from 'src/app/service/comparision.service';
import { SectorService } from 'src/app/service/sector.service';
import { StockExchangeService } from 'src/app/service/stock-exchange.service';

@Component({
  selector: 'app-comparision-comp-sector',
  templateUrl: './comparision-comp-sector.component.html',
  styleUrls: ['./comparision-comp-sector.component.css']
})
export class ComparisionCompSectorComponent implements OnInit {

  companies:any[];
  sectors:any[];
  exchanges:any[];
  periodicityList:any[] = ['Day','Week','Month','Quarter'];

  selectedCompanies:any[] = [];
  selectedSectors:any[] = [];
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
    private sectorService:SectorService,
    private stockExchangeService:StockExchangeService,
    private comparisionService:ComparisionService,
    private toastr:ToastrService, 
    private elementRef: ElementRef) { }

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
    this.companyService.getCompanies().subscribe(res => {
      this.companies = [...res];
      console.log(this.companies);
    },
    err=>{
      this.toastr.error(err.error,'',this.timeout);
    })

    this.sectorService.getSectors().subscribe(res => {
      this.sectors = [...res];
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
      if(this.selectedCompanies.length!=0 && this.selectedSectors.length!=0){
        let dataObjs = [];
        let labels = this.generateDateRange();
        let fetchList = new Promise<void>((resolve) => {
          this.selectedCompanies.forEach(async (company,index,array) => {
            await this.comparisionService.getStockPricesForCompany(company.id,this.selectedExchange[0].name,
              this.fromPeriod,this.toPeriod,this.selectedPeriod[0]).toPromise().then((response)=>{
                let prices = [];
                if(Object.keys(response).length>0){
                  let stockDates = Object.keys(response);
                  labels.forEach((label)=>{
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
                  borderColor: 'rgba(255, 99, 132, 1)',
                  fill:false
                }
                dataObjs.push(dataObj);
              })
          });
          this.selectedSectors.forEach(async (sector,index,array) => {
            await this.comparisionService.getStockPricesForSector(sector.id,this.selectedExchange[0].name,
              this.fromPeriod,this.toPeriod,this.selectedPeriod[0]).toPromise().then((response)=>{
                let prices = [];
                if(Object.keys(response).length>0){
                  let stockDates = Object.keys(response);
                  labels.forEach((label)=>{
                    if(stockDates.includes(label)){
                      prices.push(response[label].toFixed(2));
                    }
                    else{
                      prices.push(undefined);
                    }
                  })
                }
                let dataObj = {
                  label: sector.name,
                  data: prices,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  fill:false
                }
                dataObjs.push(dataObj);
              })
              if(index == array.length-1){
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
          },1000)
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
        dateRange.push(new Date(fromDate));
      }
    }
    else if(period == 'Month' || period == 'Quarter'){
      let month = (period == 'Month')? 1 : 3;
      for(fromDate;fromDate<toDate;fromDate.setMonth(fromDate.getMonth()+month)){
        dateRange.push(new Date(fromDate));
      }
    }
    dateRange.push(toDate);
    dateRange = dateRange.map((v)=>v.toISOString().slice(0,10));
    return dateRange;
  }

  reset(){
    this.selectedCompanies = [];
    this.selectedSectors = [];
    this.selectedExchange = [];
    this.selectedPeriod = [];
    this.fromPeriod = null;
    this.toPeriod = null;
  }

}
