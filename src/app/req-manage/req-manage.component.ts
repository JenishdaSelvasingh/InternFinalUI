import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from '../user-table/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-req-manage',
  templateUrl: './req-manage.component.html',
  styleUrls: ['./req-manage.component.css']
})
export class ReqManageComponent implements OnInit {

  reqs:any;

  constructor(private formService:DataService, private http:HttpClient) 
  { }

  @Output() reqPopupClose = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.formService.getRequests().subscribe((data)=>{
      this.reqs=data;
    });
  }

  closeForm(ntId:string, item:string) {
    const bodyData = {
      "ntId": ntId,
      "itemType": item,
    }
    this.formService.acceptRequest(bodyData).subscribe((data:any)=>{
      console.log(data);
    })
  
    // console.log(this.data.value);
    // const formComponent = document.querySelector('app-update');
    // const userTableComponent = document.querySelector('#bgScreen');
    // const userTableComponent1 = document.querySelector('#bgScreen1');
    // if (userTableComponent && userTableComponent1) {
    //   userTableComponent.classList.remove('blur');
    //   userTableComponent1.classList.remove('blur');
    // }
    // if (formComponent) {
    //   formComponent.classList.add('hidden');
    // }

    // console.log(this.selectedItems);
    window.location.reload();
    this.reqPopupClose.emit(false);
  }

  close(){
    this.reqPopupClose.emit(false);
  }

  test(){

  }

  acceptReq(ntId: string, item: string) {
    const bodyData = {
      ntId: ntId,
      itemType: item,
    };
  
    this.formService.acceptRequest(bodyData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.slackReq("Request for " + item + " by " + ntId + " is accepted.");
        this.reqPopupClose.emit(false);
        // window.location.reload();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }


  


  slackReq(message:string){
    const url = 'https://cors-anywhere.herokuapp.com/https://hooks.slack.com/services/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';
    const token = 'xoxb-7284925047584-7262041154019-340Stk2LOIpr0HzM48KX2oOo';
    // const headers = new HttpHeaders(
    //   {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
    // );
    const body = { text: message };

    this.http.post(url, body, {  responseType: 'text' })
      .subscribe(
        response => {
          console.log('Message sent successfully', response);
        },
        error => {
          console.error('Error sending message', error);
        }
      );
  }

}
