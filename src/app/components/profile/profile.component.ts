import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/models/UserDto';
import { TokenStorageService } from 'src/app/security/token-storage.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any;

  user:UserDto = new UserDto();
  editProfileDisplay = 'none';
  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true};
  errorMessage;

  constructor(private token: TokenStorageService,
    private authService:AuthService,
    private toastr:ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  editProfile(){
    this.editProfileDisplay = 'block';
    this.user.username = this.currentUser.username;
    this.user.mobileNumber = this.currentUser.mobileNumber;
  }

  onSubmit({value, valid}: {value: UserDto, valid: boolean}) {
    if(!valid) {
      this.toastr.error('Fill out the user form properly!','',this.timeout);
    }
    else{
      this.authService.edit(this.user).subscribe(
        data => {
          this.logout();
        },
        err => {
          this.errorMessage = err.error;
          this.toastr.error(this.errorMessage,'',this.timeout);
        }
      );
    }
  }

  logout(): void {
    this.token.signOut();
    this.router.navigate(['']);
  }

  reset(){
    this.editProfileDisplay = 'none';
  }

}
