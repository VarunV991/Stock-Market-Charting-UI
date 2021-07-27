import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IpoService } from 'src/app/service/ipo.service';
import { IpoDto } from '../../../models/IpoDto';

@Component({
  selector: 'app-create-ipo',
  templateUrl: './create-ipo.component.html',
  styleUrls: ['./create-ipo.component.css']
})
export class CreateIpoComponent implements OnInit {

  ipo:IpoDto = new IpoDto();
  operationHeader:string = "Add Ipo"
  editOperation:boolean = false;

  public timeout:any = {timeOut:10000,closeButton:true,escapeHtml:true}

  constructor(private ipoService:IpoService,
    private router:Router,
    private toastr:ToastrService) {
      const navigation = this.router.getCurrentNavigation();
      if(navigation.extras.replaceUrl === undefined){
        const state = navigation.extras.state;
        this.operationHeader = state.operationHeader;
        this.ipo = state.ipo;
        this.editOperation = state.editOperation;
      }
     }

  ngOnInit(): void {
  }

  onSubmit({value, valid}: {value: IpoDto, valid: boolean}) {
    if(valid){
      if(this.editOperation){
        this.ipoService.editIpo(this.ipo).subscribe((responseData) => {
            this.router.navigate(['/ipos']);
          },
          err=>{
            this.toastr.error(err.error,'',this.timeout);
          });
      }
      else{
        this.ipoService.addIpo(this.ipo).subscribe((responseData) => {
            this.router.navigate(['/ipos']);
          },
          err=>{
            this.toastr.error(err.error,'',this.timeout);
          });
      }
    }
  }

}
