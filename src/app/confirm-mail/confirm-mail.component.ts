import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.css']
})
export class ConfirmMailComponent implements OnInit {

  constructor() { }

  @Output() boolConfirm = new EventEmitter<boolean>();

  ngOnInit(): void {
  }
  onConfirm(){
  const AlertBoxComponent = document.querySelector('#testMail');

    if (AlertBoxComponent) {
      AlertBoxComponent.classList.add('hidden');
    }

    this.boolConfirm.emit(true);
  }

  onCancel(){
    const AlertBoxComponent = document.querySelector('#testMail');

    if (AlertBoxComponent) {
      AlertBoxComponent.classList.add('hidden');
    }
    this.boolConfirm.emit(false);
  }

}
