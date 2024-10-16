import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as shajs from 'sha.js';
import { interval, Subscription } from "rxjs";
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
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-req',
  templateUrl: './reset-req.component.html',
  styleUrls: ['./reset-req.component.css']
})
export class ResetReqComponent implements OnInit {

  resetB: boolean = false;
  verifyB: boolean = false;
  hr:string = '';
  mn:string = '';
  sec:string = '';
  period:string = '';
  spinnerName:string = 'display-spinner';

  data = new FormGroup({
    mail: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    otp: new FormControl('', [
      Validators.required,
      Validators.maxLength(5),
      Validators.minLength(5)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")
    ]),
    confirmpass: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      this.matchPassword.bind(this)
    ])
  });

  constructor(private http: HttpClient, private router: Router, private spinner:NgxSpinnerService) { }

  currentTime = new Date();
  currentTimeSub: Subscription | undefined;

  ngOnInit() {
    this.currentTimeSub = interval(0).subscribe(count => {
      this.currentTime = new Date();
      this.updateTime(this.currentTime);
    });
  }

  updateTime(date: Date): void {
    this.spinner.show(this.spinnerName);

    setTimeout(() => {
      this.spinner.hide(this.spinnerName);
    }, 3000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    this.hr = this.addZero(this.convertTo12HourFormat(hours)).toString();
    this.mn = this.addZero(minutes).toString();
    this.sec = this.addZero(seconds).toString();
    this.period = hours >= 12 ? 'PM' : 'AM';
  }

  convertTo12HourFormat(hours: number): number {
    return hours % 12 === 0 ? 12 : hours % 12;
  }


  addZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  ngOnDestroy() {
    this.currentTimeSub!.unsubscribe();
  }
  
  matchPassword(control: FormControl): { [key: string]: boolean } | null {
    if (this.data) {
      return control.value === this.data.get('password')?.value ? null : { mismatch: true };
    }
    return null;
  }

  sendOTP() {
    const bodyData = {
      email: this.data.value.mail,
      otp: this.data.value.otp
    };

    this.http.post('http://localhost:8080/reset-password', bodyData, { responseType: 'text' }).subscribe(res => {
      console.log(res);
      this.verifyB = true;
      this.openToastOtp('info');
    });
  }

  verifyOTP() {
    this.http.post('http://localhost:8080/verify-otp?otp=' + this.data.value.otp + '&email=' + this.data.value.mail, '', { responseType: 'text' }).subscribe((res: any) => {
      console.log(res);
      if (res) {
        localStorage.setItem('reset', this.data.value.mail!);
        this.resetB = true;
        this.verifyB=false;
        if(res==="true"){
          this.openToastVerify('success');
        } else {
          this.openToastDenied('alert');
        }
      } else {
        console.log("Wrong otp");
      }
    },
    (error) => {
      console.error('Error occurred during OTP verification:', error);
    });
  }

  public service: ToastifyService = inject(ToastifyService);

  openToastOtp(type: ToastTypeEnum | string) {
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
    toast.openToast('Otp Sent Successfully!');
  }

  openToastDenied(type: ToastTypeEnum | string) {
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
    toast.openToast('Otp verification denied!');
  }

  openToastVerify(type: ToastTypeEnum | string) {
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
    toast.openToast('Otp Verified, Change your password');
  }

  resetPass() {
    const pass:string = this.data.value.password || '';
    this.http.post('http://localhost:8080/pass-change?email=' + localStorage.getItem('reset') + '&password=' + shajs('sha256').update(pass).digest('hex'), '',{ responseType: 'text' }).subscribe((res: any) => {
      console.log('Password Reset Successfully');
      if (res === "changed") {
        localStorage.removeItem('reset');
        this.router.navigate(['/login']);
      }
    });
  }
}
