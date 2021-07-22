import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environmentURL } from "src/environments/environment";
import { UserDto } from "../models/UserDto";

@Injectable({providedIn: 'root'})
export class AuthService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = environmentURL.url+'/user';
    }

    public createUser(user:UserDto){
        return this.http.post(this.url+`/add`,user);
    }

    public login(user:UserDto){
        return this.http.post(this.url+`/login`,user,{responseType:'text'});
    }
}