import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from '../user-table/data.service';
import { NgxSpinnerService } from "ngx-spinner";
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
import { NgConfirmService } from 'ng-confirm-box';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css']
})
export class ViewTableComponent implements OnInit {


  deletionRow: any;
  hover: boolean = false;
  file!: string | Blob;
  fileSelect: boolean = false;

  constructor(
    private formService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadFormss();
  }
  mailRow: any;
  selected: any[] = [];
  delSelected: string[] = [];
  delFlag:boolean=false;
  searchBool: boolean = false;
  pageKeep: number = 0;
  forms: any;
  pageNumber: number = 0;
  pageSize: number = 10;
  columnMode = ColumnMode;
  totall: number = 0;
  sort: string = 'name';
  direction: string = 'asc';
  data: any = {};
  boolSort: Boolean = false;
  rowColors: Boolean = true;
  SelectionType = SelectionType;
  ClientArray: any[] = [];
  columns: any[] = [];
  addUserPopup: boolean = false;
  addUpdatePopup: boolean = false;
  addAlert: boolean = false;
  multiDelActive:boolean = false;
  // mailDecide: boolean = false;

  private formatFormData(forms: any): any {
    return forms.content.map((form: any) => {
      const timeFormattedDate = new Date(form.timeFormatted);
      const formattedTime = `${timeFormattedDate.getDate()}-${timeFormattedDate.getMonth() + 1}-${timeFormattedDate.getFullYear()} / ${timeFormattedDate.getHours()}:${timeFormattedDate.getMinutes()}`;
      return { ...form, timeFormatted: formattedTime };
    });
  }

  loadFormss() {
    // this.formService.getForms(this.pageNumber, this.pageSize)
    //   .subscribe((forms: any) => {
    //     this.forms = this.formatFormData(forms);
    //     this.totall = forms.totalElements;
    //     this.pageKeep = this.pageNumber;
    //   });
  }
  onSelect({ selected }: any) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.delFlag = this.selected.length > 0;
    this.delSelected = this.selected.map(item => item.ntId);
    console.log(this.delSelected);
  }


  onActivate(event: any) {
    // console.log('Activate Event', event);
  }





  onPageChange(event: any): void {
    this.pageNumber = event.offset;
    if (this.searchBool) {
      this.onSearch();
    } else if (this.boolSort) {
      this.fetchData();
    } else {
      this.loadFormss();
    }
  }

  onSort(event: any): void {
    this.sort = event.sorts[0].prop;
    this.direction = event.sorts[0].dir;
    this.boolSort = true;
    if (this.searchBool) {
      this.onSearch();
    } else {
      this.fetchData();
    }
  }


  fetchData(): void {
    // this.formService.fetchData(this.pageNumber, this.pageSize, this.sort, this.direction)
    //   .subscribe((forms: any) => {
    //     this.forms = this.formatFormData(forms);
    //     this.totall = forms.totalElements;
    //     this.pageKeep = this.pageNumber;
    //   });
  }

  onSearch(filter?: string): void {
    if (filter) {
      this.searchBool = true;
    }
    // this.formService.searchForms(this.pageNumber, this.pageSize, filter || '')
    //   .subscribe((forms: any) => {
    //     this.forms = this.formatFormData(forms);
    //     this.totall = forms.totalElements;
    //   });
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


  onGetRowClass = (boo: { manager: string; }) => {
    if (this.rowColors && boo.manager.length != 0) {
      this.rowColors = false;
      return "blueRow";
    } else {
      this.rowColors = true;
      return "whiteRow";
    }
  }

  

}
