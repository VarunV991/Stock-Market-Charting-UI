import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/UserDto';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    let user = new UserDto();
    user.username = this.username;
    user.password = this.password;
    this.authService.login(user).subscribe(res => {
      
    })
  }

}
