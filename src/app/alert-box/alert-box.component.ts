import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent implements OnInit {

  constructor() { }

  @Output() alertClose = new EventEmitter<boolean>();

  ngOnInit(): void {
  }


  onConfirm(){
    const AlertBoxComponent = document.querySelector('#test');

    if (AlertBoxComponent) {
      AlertBoxComponent.classList.add('hidden');
    }

    this.alertClose.emit(true);
  }

  onCancel(){
    const AlertBoxComponent = document.querySelector('#test');

    if (AlertBoxComponent) {
      AlertBoxComponent.classList.add('hidden');
    }
    this.alertClose.emit(false);
  }

}
