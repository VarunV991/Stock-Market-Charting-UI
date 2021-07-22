import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAuthenticated: boolean = true;
  isAdmin: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLogoutClick(){
    this.isAuthenticated = false;
  }

}
