import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IpoDto } from "../models/IpoDto";

@Injectable({providedIn: 'root'})
export class IpoService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = 'http://localhost:8080/ipo';
    }

    public getIpos():Observable<any>{
        return this.http.get(this.url);
    }

    public getIpoById(id):Observable<any>{
        return this.http.get(this.url+"/"+id);
    }

    public addIpo(ipo:IpoDto){
        this.http.post(this.url+`/add`,ipo).subscribe((responseData) => {
            this.router.navigate(['/ipos']);
          });
    }

    public editIpo(ipo:IpoDto){
        this.http.put(this.url + "/edit" , ipo).subscribe((responseData) => {
            this.router.navigate(['/ipos']);
          });
    }

}