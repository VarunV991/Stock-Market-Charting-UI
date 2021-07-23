import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ServerUrl } from "../ServerUrl";

@Injectable({providedIn: 'root'})
export class SectorService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = ServerUrl.url+'/sector';
    }

    public getSectors():Observable<any>{
        return this.http.get(this.url);
    }
}