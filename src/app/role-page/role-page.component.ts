import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../user-table/data.service';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import {
  AppearanceAnimation,
  DisappearanceAnimation,
  ProgressBar,
  TextAlignEnum,
  ToastifyService,
  ToastPosition,
  ToastTypeEnum,
} from '@ng-vibe/toastify';
@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {


  forms:any;
  addPopUp:boolean=false;

  constructor(private http:HttpClient, private formService:DataService) { }

  ngOnInit(): void {
    localStorage.removeItem('page');
    localStorage.setItem('page','role');
    this.loadForms();
  }



  loadForms(): void {
    this.formService.getRoles().subscribe((forms: any) => {
      this.forms=forms;
      console.log(this.forms);
    });
  }
  

  addPopupClose(event:boolean){
    if(event){
      this.addPopUp=false;
    }else{
      this.addPopUp=false;
      this.loadForms();
      this.openToastRole('success');
    }
    
  }


  public service: ToastifyService = inject(ToastifyService);

  openToastRole(type: ToastTypeEnum | string) {
    const toast = new ToastifyRemoteControl();
    toast.options = {
      autoCloseDuration: 1000,
      layoutType: type as ToastTypeEnum,
      position: ToastPosition.TOP_RIGHT,
      progressBar: ProgressBar.DECREASE,
      textAlign: TextAlignEnum.START,
      animationIn: AppearanceAnimation.FADE_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT
    };
    toast.openToast('Role Successfully Added!');
  }

  addPopupOpen(){
    this.addPopUp=true;
  }

  

}
