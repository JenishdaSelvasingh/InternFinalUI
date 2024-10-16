import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from './data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import { interval, Subscription } from 'rxjs';
import {
  AppearanceAnimation,
  DisappearanceAnimation,
  ProgressBar,
  TextAlignEnum,
  ToastifyService,
  ToastPosition,
  ToastTypeEnum,
} from '@ng-vibe/toastify';
import { NgConfirmService } from 'ng-confirm-box';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnDestroy {
  deletionRow: any;
  hover: boolean = false;
  file!: string | Blob;
  fileSelect: boolean = false;
  private intervalSubscription!: Subscription;
  constructor(
    private formService: DataService,
    private confirmService: NgConfirmService,
    private router: Router,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.loadForms();
    localStorage.removeItem('page');
    localStorage.setItem('page','admin');
    const jwtHelper = new JwtHelperService();
    const accessToken = localStorage.getItem('accessToken') || "";
    const decodedToken = jwtHelper.decodeToken(accessToken);
    const accessTags = decodedToken.accessTags[0];
    if(accessTags=="ADMIN"){
      this.getRequest();
      this.intervalSubscription = interval(5000).subscribe(() => {
        this.getRequest();
      });
    }
  }
  ngOnDestroy(): void {
    if(this.intervalSubscription){
      this.intervalSubscription.unsubscribe();
    }
  }
  mailRow: any;
  roleDisable: boolean = this.setVal();
  selected: any[] = [];
  delSelected: string[] = [];
  previousSelection: any[] = [];
  delFlag:boolean=false;
  searchBool: boolean = false;
  pageKeep: number = 0;
  forms: any;
  pageNumber: number = 0;
  pageSize: number = 8;
  columnMode = ColumnMode;
  totall: number = 0;
  sort: string = 'name';
  direction: string = 'asc';
  searchDir:string = 'desc';
  data: any = {};
  boolSort: Boolean = false;
  rowColors: Boolean = true;
  SelectionType = SelectionType;
  ClientArray: any[] = [];
  columns: any[] = [];
  addUserPopup: boolean = false;
  addUpdatePopup: boolean = false;
  addReqPopup: boolean = false;
  addAlert: boolean = false;
  multiDelActive:boolean = false;
  searchKeys: string[] = [];
  reqs:any[]=[];
  searchString:string='';
  setVal(){
    const jwtHelper = new JwtHelperService();
    const accessToken = localStorage.getItem('accessToken') || "";
    const decodedToken = jwtHelper.decodeToken(accessToken);
    const accessTags = decodedToken.accessTags[0];
    return (accessTags === 'ADMINUSER');
  }
  private formatFormData(forms: any): any {
    return forms.content.map((form: any) => {
      const timeFormattedDate = new Date(form.timeFormatted);
      const formattedTime = `${timeFormattedDate.getDate()}-${timeFormattedDate.getMonth() + 1}-${timeFormattedDate.getFullYear()} / ${timeFormattedDate.getHours()}:${timeFormattedDate.getMinutes()}`;
      return { ...form, timeFormatted: formattedTime };
    });
  }
  isDisabled(){
    return this.roleDisable;
  }
  loadForms() {
    this.formService.getForms(this.pageNumber, this.pageSize)
      .subscribe((forms: any) => {
        this.forms = this.formatFormData(forms);
        this.totall = forms.totalElements;
        this.pageKeep = this.pageNumber;
      });
  }
  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.delFlag = this.selected.length > 0;
    this.delSelected = this.selected.map(item => item.ntId);
    console.log(this.delSelected);
    const unselected = this.previousSelection.filter(row => !selected.includes(row));
    if (unselected.length > 0) {
      this.delFlag=false;
    }
  }
  getRequest(){
    this.formService.getRequests()
    .subscribe((response: any) => {
      console.log(response);
      this.reqs=response;
    });
  }
  onActivate(event: any) {
    // console.log('Activate Event', event);
  }
  onMultiDel() {
    const AlertBoxComponent = document.querySelector('#test');
    if (AlertBoxComponent) {
      AlertBoxComponent.classList.remove('hidden');
      this.multiDelActive = true;
    }
  }
  onMultiDelImp(){
    if(this.addAlert==true){
      this.http.post(`http://localhost:8080/multiDelete`,this.delSelected, { responseType: 'text' })
      .subscribe(() => {
        this.loadForms();
        this.openToastUsers('danger');
        this.multiDelActive=false;
        this.delSelected=[];
        // this.fileSelect=false;
      });
    }
  }
  onPageChange(event: any): void {
    this.pageNumber = event.offset;
    if (this.searchBool) {
      this.onSearch(this.searchString);
    } else if (this.boolSort) {
      this.fetchData();
    } else {
      this.loadForms();
    }
  }
  onSort(event: any): void {
    this.sort = event.sorts[0].prop;
    this.direction = event.sorts[0].dir;
    if(this.direction=="asc"){
      this.searchDir="desc";
    } else{
      this.searchDir = "asc";
    }
    this.boolSort = true;
    if (this.searchBool) {
      this.onSearch(this.searchString);
    } else {
      this.fetchData();
    }
  }
  sendMail(row: any){
    this.http.get(`http://localhost:8080/send-email/${row}`, { responseType: 'text' })
        .subscribe((rep: any) => {
          console.log(rep);
        });
  }
  fetchData(): void {
    this.formService.fetchData(this.pageNumber, this.pageSize, this.sort, this.direction)
      .subscribe((forms: any) => {
        this.forms = this.formatFormData(forms);
        this.totall = forms.totalElements;
        this.pageKeep = this.pageNumber;
      });
  }
  toggleSearchKey(key: string): void {
    const index = this.searchKeys.indexOf(key);
    if (index === -1) {
      this.searchKeys.push(key);
    } else {
      this.searchKeys.splice(index, 1);
    }
    if(this.searchString!=''){
      this.onSearch(this.searchString);
    }
  }
  onSearch(filter?: string): void {
    this.searchString = filter || '';
    if (this.searchKeys.length > 0) {
      if (filter) {
        this.searchBool = true;
      }
      this.formService.searchAny(this.pageNumber, this.pageSize, this.searchKeys, filter || '', this.sort, this.searchDir)
      .subscribe((forms: any) => {
        this.forms = this.formatFormData(forms);
        this.totall = forms.totalElements;
      });
    } else {
      if (filter) {
        this.searchBool = true;
      }
      this.formService.searchForms(this.pageNumber, this.pageSize, filter || '', this.sort, this.searchDir)
        .subscribe((forms: any) => {
          this.forms = this.formatFormData(forms);
          this.totall = forms.totalElements;
        });
    }
  }
  unselectFile(){
    this.file = '';
    this.fileSelect = false;
  }
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    this.fileSelect = true;
  }
  colDefs: any[] = [
    { prop: "name", name: "Name" },
    { prop: "ntId", name: "Nt Id" },
    { prop: "email", name: "Email" },
    { prop: "manager", name: "Manager" },
    { prop: "timeFormatted", name: "Time" }
  ];
  checker(event: any) {
    console.log(event);
  }
  openForm() {
    this.addUserPopup = true;
  }
  addUserPopupClose(event: Boolean) {
    this.addUserPopup = false;
    this.loadForms();
  }
  RequestPopupClose(event: Boolean) {
    this.addReqPopup = false;
  }
  addReqPopupOpen() {
    this.addReqPopup = true;
  }
  addUpdatePopupClose(event: Boolean) {
    this.addUpdatePopup = false;
    this.loadForms();
  }
  addAlertBox(event: boolean) {
    this.addAlert = event;
    this.delFlag = false;
    if(this.multiDelActive == true){
      this.onMultiDelImp();
    }else{
      this.deletion();
    }
  }
  editRow(row: any) {
    this.addUpdatePopup = true;
    this.formService.searchForms(this.pageNumber, this.pageSize, row,this.sort,this.searchDir)
      .subscribe((forms: any) => {
        const form = forms.content[0];
        this.formService.setFormData(form);
      });
  }
  onGetRowClass = (row: any, rowIndex: number) => {
    return rowIndex % 2 === 0 ? 'blueRow' : 'whiteRow';
  }
  deleteRow(row: any) {
    const AlertBoxComponent = document.querySelector('#test');
    if (AlertBoxComponent) {
      AlertBoxComponent.classList.remove('hidden');
      this.deletionRow = row;
    }
  }
  deletion() {
    if (this.addAlert == true) {
      this.http.delete(`http://localhost:8080/delete/${this.deletionRow}`, { responseType: 'text' })
        .subscribe(() => {
          this.loadForms();
          this.openToast('danger');
        });
    }
  }
  public service: ToastifyService = inject(ToastifyService);
  openToastUsers(type: ToastTypeEnum | string) {
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
    toast.openToast('Users Successfully Deleted!');
  }
  openToast(type: ToastTypeEnum | string) {
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
    toast.openToast('Users Successfully Deleted!');
  }
  openToastError(type: ToastTypeEnum | string) {
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
    toast.openToast('Alert: Error found and not added!');
  }
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
    toast.openToast('Users successfully loaded from file.');
  }
  sendFile() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.http.post("http://localhost:8080/upload", formData, { responseType: 'text' })
      .subscribe(() => {
        console.log(formData);
        this.loadForms();
        this.fileSelect=false;
        this.openToastSuccess('success');
      },
      error=> {
        this.fileSelect=false;
        this.openToastError('danger');
      }
    );
  }
}