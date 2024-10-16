import { Component, OnInit, inject } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from '../user-table/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import SlackNotify from 'slack-notify';
import {
  AppearanceAnimation,
  DisappearanceAnimation,
  ProgressBar,
  TextAlignEnum,
  ToastifyService,
  ToastPosition,
  ToastTypeEnum,
} from '@ng-vibe/toastify';
import { map } from 'rxjs';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit {

  constructor(private formService: DataService, private http:HttpClient) { }

  mailRow: any;
  selected: any[] = [];
  searchBool: boolean = false;
  pageKeep: number = 0;
  forms: any;
  pageNumber: number = 0;
  pageSize: number = 10;
  columnMode = ColumnMode;
  totall: number = 0;
  sort: string = 'name';
  direction: string = 'asc';
  boolSort: boolean = false;
  rowColors: boolean = true;
  SelectionType = SelectionType;
  ntIdv:string = '';
  namev:string = '';
  deviceIdsv:[] = [];
  mailv:string='';
  public settings = {};
  dropdownList:Array<{ item_text: string }> = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings={};


  columns: any[] = [
    { prop: "deviceId", name: "Device Id" },
    { prop: "timeFormatted", name: "Time" }
  ];

  ngOnInit(): void {
    this.loadForms();
    this.formService.getUserId().subscribe((user:any)=> {
      console.log(user);
      this.ntIdv = user.ntId;
      this.namev = user.name;
      this.deviceIdsv = user.deviceId;
      this.mailv = user.email;
    });

    this.dropdownList = [];
    this.selectedItems = [ ];

    this.formService.getTypes().pipe(
      map((response: any) => {
        if (response && Array.isArray(response.types)) {
          return response.types.map((item: string) => ({ item_text: item }));
        } else {
          console.error('Unexpected response structure', response);
          return [];
        }
      })
    ).subscribe(mappedResponse => {
      this.dropdownList = mappedResponse;
    }, error => {
      console.error('Error fetching ids', error);
    });

    this.settings = {
      singleSelection: true,
      idField: 'item_text',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: -1,
      maxHeight: 250,
      maxWidth:50
    };
  }

  private formatFormData(forms: any): any {
    return forms.map((form: any) => {
      const formattedTime = moment(form.timeFormatted).format("YYYY-MM-DD / HH:mm:ss");
      return { ...form, formattedTime: formattedTime };
    });
  }
  
  

  loadForms(): void {
    this.formService.getLogs().subscribe((forms: any) => {
      this.forms = this.formatFormData(forms);
      this.forms.sort((a: any, b: any) => {
        return new Date(b.timeFormatted).getTime() - new Date(a.timeFormatted).getTime();
      });
      console.log(this.forms);
    });
  }
  

  sendReq(){
    const selectedItem = this.selectedItems.length > 0 ? this.selectedItems[1] : '';
    const bodyData = {
      itemType:selectedItem,
      ntId:this.ntIdv
    };

    this.http.post("http://localhost:8080/setReq", bodyData, { responseType: 'text' })
      .subscribe((resultData: any) => {
        
        this.slackReq(this.ntIdv+" has requested for "+selectedItem+"!");
        // this.sendDirectMessage("U0782PG2V17",this.ntIdv+" has requested for "+selectedItem+"!");
        this.openToastSuccess('success');
        this.selectedItems=[];
      },
      error=> {
        // this.openToastError('danger');
      }
    );
  }

  // sendNotify() {
    
  //   const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/RANDOMCHARS';
  //   var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);


    // slack.send('Hello!')
    //   .then(() => {
    //     console.log('done!');
    //   }).catch((err: any) => {
    //     console.error(err);       
    //   });
  // }

  

  slackReq(message:string){
    const url = 'https://cors-anywhere.herokuapp.com/https://hooks.slack.com/services/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';
    const token = 'xoxb-7284925047584-7262041154019-340Stk2LOIpr0HzM48KX2oOo';
    const headers = new HttpHeaders(
      {'Content-Type': 'application/json','Authorization': `Bearer ${token}`}
    );
    const body = { text: message };

    this.http.post(url, body, { headers, responseType: 'text' })
      .subscribe(
        response => {
          console.log('Message sent successfully', response);
        },
        error => {
          console.error('Error sending message', error);
        }
      );
  }


  sendDirectMessage(userId: string, message: string) {
    const slackApiUrl = 'https://cors-anywhere.herokuapp.com/https://slack.com/api/chat.postMessage';
    const slackToken = 'xoxb-7284925047584-7262041154019-340Stk2LOIpr0HzM48KX2oOo';
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${slackToken}`
    });


  
    const body = {
      channel: userId,
      text: message
    };
  
    this.http.post(slackApiUrl, body, { headers, responseType: 'text' })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.ok) {
            console.log('Message sent successfully', response);
          } else {
            console.error('Error sending message:', response.error);
          }
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
  }

  ConfirmMail() {
    const AlertBoxComponent = document.querySelector('#testMail');
    if (AlertBoxComponent) {
      AlertBoxComponent.classList.remove('hidden');
    }
  }

  mailBox(event: boolean){
    if(event){
      this.sendReq();
    }
  }

  public service: ToastifyService = inject(ToastifyService);

  openToastSuccess(type: ToastTypeEnum | string) {
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
    toast.openToast('Request Sent Successfully!');
  }

  onPageChange(event: any): void {
    this.pageNumber = event.offset;
    if (this.boolSort) {
      this.fetchSortedData();
    } else {
      this.loadForms();
    }
  }

  onSort(event: any): void {
    this.sort = event.sorts[0].prop;
    this.direction = event.sorts[0].dir;
    this.boolSort = true;
    this.fetchSortedData();
  }

  fetchSortedData(): void {
    this.formService.getLogsSort()
      .subscribe((forms: any) => {
        this.forms = this.formatFormData(forms);
        this.totall = forms.totalElements;
        this.pageKeep = this.pageNumber;
      });
  }

  onGetRowClass = (row: any) => {
    if (row.manager && row.manager.length > 0) {
      return "blueRow";
    } else {
      return "whiteRow";
    }
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item.item_text);
    console.log(item.item_text);
  }
  onSelectAll(items: any) {
    console.log(items.item_text);
    this.selectedItems.push(items);
  }
}
