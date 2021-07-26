import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/UserDto';
import { ServerUrl } from '../ServerUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    url:String;

  constructor(private http: HttpClient) {
    this.url = ServerUrl.url + "/user";
   }

  login(userDto:UserDto): Observable<any> {
    return this.http.post(this.url + `/login`, userDto, httpOptions);
  }

  register(userDto:UserDto): Observable<any> {
    return this.http.post(this.url + `/signup`, userDto, {responseType:'text'});
  }

  edit(userDto:UserDto):Observable<any> {
    return this.http.patch(this.url+`/edit`,userDto, httpOptions);
  }
}