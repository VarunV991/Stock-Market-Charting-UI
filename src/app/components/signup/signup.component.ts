import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UserDto } from '../../models/UserDto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:UserDto = new UserDto();

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true};

  constructor(private authService:AuthService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit({value, valid}: {value: UserDto, valid: boolean}) {
    if(!valid) {
      this.toastr.error('Fill out the User form properly!','',this.timeout);
    }
    this.authService.createUser(value);
  }

}
