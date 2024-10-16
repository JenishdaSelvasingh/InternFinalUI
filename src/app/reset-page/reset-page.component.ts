import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.css']
})
export class ResetPageComponent implements OnInit {

  data = new FormGroup({
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

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  matchPassword(control: FormControl): { [key: string]: boolean } | null {
    if (this.data) {
      return control.value === this.data.get('password')?.value ? null : { mismatch: true };
    }
    return null;
  }

  resetPass() {
    if (this.data.valid) {
      const bodyData = {
        password: this.data.get('name')?.value,
      };
    }
  }

}
