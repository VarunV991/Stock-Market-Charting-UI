import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StockExchangeDto } from "../models/StockExchangeDto";

@Injectable({providedIn: 'root'})
export class StockExchangeService{

    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = 'https://smc-service.herokuapp.com/stock-exchange';
    }

    public getStockExchanges():Observable<any>{
        return this.http.get(this.url);
    }

    public addStockExchange(stockExchange:StockExchangeDto){
        this.http.post(this.url+`/add`,stockExchange).subscribe((responseData) => {
            this.router.navigate(['/stock-exchanges']);
          });
    }

    public editStockExchange(stockExchange:StockExchangeDto){
        this.http.put(this.url+`/edit`,stockExchange).subscribe((responseData) => {
            this.router.navigate(['/stock-exchanges']);
          });
    }

    public getCompaniesinExchange(name:string):Observable<any>{
        return this.http.get(this.url+"/"+name+"/companies");
    }
}