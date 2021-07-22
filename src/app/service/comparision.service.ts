import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ComparisionService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = 'http://localhost:8080/stock-price';
    }

    public getStockPricesForCompany(id,exchangeName,fromDate,toDate,periodicity):Observable<any>{
        return this.http.get(this.url+`/company/`+id+`/`+exchangeName+`/`+fromDate+`/`+toDate+`/`+periodicity);
    }

    public getStockPricesForSector(id,exchangeName,fromDate,toDate,periodicity):Observable<any>{
        return this.http.get(this.url+`/sector/`+id+`/`+exchangeName+`/`+fromDate+`/`+toDate+`/`+periodicity);
    }
}