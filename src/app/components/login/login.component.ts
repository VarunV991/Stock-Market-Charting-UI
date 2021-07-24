import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/models/UserDto';
import { TokenStorageService } from 'src/app/security/token-storage.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:UserDto = new UserDto();
  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string;

  constructor(private authService:AuthService,
    private tokenStorage: TokenStorageService,
    private toastr:ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.role = this.tokenStorage.getUser().role;
    }
  }

  onSubmit({value, valid}: {value: UserDto, valid: boolean}) {
    if(!valid) {
      this.toastr.error('Fill out the User Form properly!','',this.timeout);
    }
    else{
      this.authService.login(this.user).subscribe(
        data => {
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.role = this.tokenStorage.getUser().role;
          this.navigateToHomePage();
        },
        err => {
          this.errorMessage = err.error;
          this.toastr.error(this.errorMessage,'',this.timeout);
          this.isLoginFailed = true;
        }
      );
    }
  }

  navigateToHomePage(): void {
    this.router.navigate(['']).then(()=>{
      window.location.reload();
    })
  }

}
