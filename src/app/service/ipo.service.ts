import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { IpoDto } from "../models/IpoDto";
import { ServerUrl } from "../ServerUrl";

@Injectable({providedIn: 'root'})
export class IpoService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = ServerUrl.url+'/ipo';
    }

    public getIpos():Observable<any>{
        return this.http.get(this.url);
    }

    public getIpoById(id):Observable<any>{
        return this.http.get(this.url+"/"+id);
    }

    public addIpo(ipo:IpoDto):Observable<any>{
        return this.http.post(this.url+`/add`,ipo);
    }

    public editIpo(ipo:IpoDto):Observable<any>{
        return this.http.put(this.url + "/edit" , ipo);
    }

}