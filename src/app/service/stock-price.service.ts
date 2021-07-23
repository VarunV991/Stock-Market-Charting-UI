import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StockPriceDto } from "../models/StockPriceDto";
import { ServerUrl } from "../ServerUrl";

@Injectable({providedIn: 'root'})
export class StockPriceService{
    
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = ServerUrl.url+'/stock-price';
    }

    public addStockPriceList(stockPrices:StockPriceDto[]):Observable<any>{
        return this.http.post(this.url+`/addList`,stockPrices);
    }
}