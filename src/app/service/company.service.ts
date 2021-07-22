import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CompanyDto } from "../models/CompanyDto";

@Injectable({providedIn: 'root'})
export class CompanyService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = 'http://localhost:8080/company';
    }

    public getCompanies():Observable<any>{
        return this.http.get(this.url);
    }

    public getCompanyById(id):Observable<any>{
        return this.http.get(this.url+"/"+id);
    }

    public addCompany(company:CompanyDto){
        this.http.post(this.url+`/add`,company).subscribe((responseData) => {
            this.router.navigate(['/companies']);
          });
    }

    public editCompany(company:CompanyDto){
        return this.http.put(this.url + "/edit" , company).subscribe((responseData) => {
            this.router.navigate(['/companies']);
          });
    }

    public deleteCompany(id):Observable<any>{
        return this.http.delete(this.url + "/" + id,{ responseType: 'text' });
    }

    public mapCompanyExchangeCode(name,codeMappings):Observable<any>{
        return this.http.post(this.url+`/`+name+`/addExchangeCodes`,codeMappings,
        { responseType: 'text' });
    }

    public getCompanyIpoDetails(name):Observable<any>{
        return this.http.get(this.url+`/`+name+`/ipo`);
    }
}