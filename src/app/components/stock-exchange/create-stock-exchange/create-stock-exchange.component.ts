import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockExchangeService } from 'src/app/service/stock-exchange.service';
import { StockExchangeDto } from '../../../models/StockExchangeDto';

@Component({
  selector: 'app-create-stock-exchange',
  templateUrl: './create-stock-exchange.component.html',
  styleUrls: ['./create-stock-exchange.component.css']
})
export class CreateStockExchangeComponent implements OnInit {

  stockExchange:StockExchangeDto = new StockExchangeDto();
  editOperation:boolean = false;
  operationHeader = "Add Stock Exchange";

  constructor(private stockExchangeService:StockExchangeService,
    private router:Router) {
      const navigation = this.router.getCurrentNavigation();
      if(navigation.extras.replaceUrl === undefined){
        const state = navigation.extras.state;
        this.operationHeader = state.operationHeader;
        this.stockExchange = state.stockExchange;
        this.editOperation = state.editOperation;
      }
     }

  ngOnInit(): void {
  }

  onSubmit({value, valid}: {value: StockExchangeDto, valid: boolean}) {
    if(valid) {
      if(this.editOperation){
        this.stockExchangeService.editStockExchange(this.stockExchange);
      }
      else{
        this.stockExchangeService.addStockExchange(this.stockExchange);
      }
    }
  }

}
