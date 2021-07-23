import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserDto } from "../models/UserDto";
import { ServerUrl } from "../ServerUrl";

@Injectable({providedIn: 'root'})
export class AuthService{
    url:string;

    constructor(private http: HttpClient, private router: Router) {
        this.url = ServerUrl.url+'/user';
    }

    public createUser(user:UserDto){
        return this.http.post(this.url+`/add`,user);
    }

    public login(user:UserDto){
        return this.http.post(this.url+`/login`,user,{responseType:'text'});
    }
}