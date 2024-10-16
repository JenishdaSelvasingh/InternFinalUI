import { HttpClient } from '@angular/common/http';
import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

  data = new FormGroup({
    userId: new FormControl('', [Validators.maxLength(50), Validators.required]),
    password: new FormControl('', [Validators.maxLength(50), Validators.required]),
  });

  @Output() popupClose = new EventEmitter<boolean>();

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  setAdmin() {
    const bodyData = {
      adminID: this.data.get('userId')?.value,
      password: this.data.get('password')?.value,
    };

    this.http.post("http://localhost:8080/setViewAdmin", bodyData, { responseType: 'text' })
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.popupClose.emit(false);
      },
      error=> {
        console.log(error);
      }
    );
  }

  closePop(){
    this.popupClose.emit(true);
  }

}
