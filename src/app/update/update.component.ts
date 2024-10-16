import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../user-table/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
import { map } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  public settings = {};
  dropdownList: Array<{ item_text: string }> = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private http: HttpClient, private router: Router, private formService: DataService) { }

  i: number = 0;
  dropdown: any;
  open1: any;
  close1: any;
  flag: Boolean = true;

  @Output() updatePopClose = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.dropdownList = [
      // { item_text: 'K4AA (Laptop)' },
      // { item_text: 'J4AA (Mouse)' },
      // { item_text: 'MNS5 (Keyboard)' },
      // { item_text: 'Navsari (Monitor)' },
    ];
    this.selectedItems = [];

    this.formService.getIds().pipe(
      map((response: any) => {
        if (response && Array.isArray(response)) {
          return response.map((item: { idValue: string; idType: string }) => ({
            item_text: `${item.idValue} (${item.idType})`
          }));
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
      singleSelection: false,
      idField: 'item_text',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: -1,
      maxHeight: 197,
    };

    const formComponent = document.querySelector('app-update');
    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
      userTableComponent.classList.add('blur');
      userTableComponent1.classList.add('blur');
    }
    if (formComponent) {
      formComponent.classList.remove('hidden');
    }

    this.formService.formData$.subscribe(form => {
      if (form) {
        this.data.get('ntId')?.disable();
        this.data.patchValue({
          name: form.name,
          ntId: form.ntId,
          email: form.email,
          manager: form.manager,
        });
        this.selectedItems = form.deviceId.map((item: string) => item.split(' ')[0]); // Split the string and get the first part
      }
    });
  }

  data = new FormGroup({
    name: new FormControl('', [Validators.maxLength(50)]),
    ntId: new FormControl('', [Validators.maxLength(50)]),
    deviceId: new FormControl(this.selectedItems, [Validators.maxLength(50)]),
    email: new FormControl('', Validators.email),
    manager: new FormControl('', Validators.maxLength(50)),
    note: new FormControl('', Validators.maxLength(255))
  });

  public service: ToastifyService = inject(ToastifyService);

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
    toast.openToast('User updated!');
  }

  onUpdate() {
    const itemList = this.selectedItems.map((test: {
      split: any; hasOwnProperty: (arg0: string) => any; item_text: any; 
}) => {
      if (typeof test === 'object' && test.hasOwnProperty('item_text')) {
        return test.item_text.split(' ')[0];
      }
      return test.split(' ')[0];
    });

    const uniqueItemList = [...new Set(itemList)];
    const processedItemList = uniqueItemList.map(item => {
      if (typeof item === 'string') {
        return item.split(' ')[0];
      }
      return item;
    });

    let bodyData = {
      name: this.data.get('name')?.value,
      ntId: this.data.get('ntId')?.value,
      deviceId: processedItemList,
      email: this.data.get('email')?.value,
      manager: this.data.get('manager')?.value,
      note: this.data.get('note')?.value,
    };

    this.http.put("http://localhost:8080/update" + "/" + bodyData.ntId, bodyData, { responseType: 'text' })
      .subscribe((resultData: any) => {
        this.data.reset();
        const formComponent = document.querySelector('app-update');
        const userTableComponent = document.querySelector('#bgScreen');
        const userTableComponent1 = document.querySelector('#bgScreen1');
        if (userTableComponent && userTableComponent1) {
          userTableComponent.classList.remove('blur');
          userTableComponent1.classList.remove('blur');
        }
        if (formComponent) {
          formComponent.classList.add('hidden');
        }

        this.updatePopClose.emit(false);
        this.toastt();
      });
  }

  toastt() {
    this.openToast('success');
  }

  closeForm() {
    const formComponent = document.querySelector('app-update');
    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
      userTableComponent.classList.remove('blur');
      userTableComponent1.classList.remove('blur');
    }
    if (formComponent) {
      formComponent.classList.add('hidden');
    }

    this.updatePopClose.emit(false);
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item.item_text.split(' ')[0]); // Split the string and get the first part
    console.log(item.item_text);
  }

  onSelectAll(items: any) {
    this.selectedItems.push(...items.map((item: any) => item.item_text.split(' ')[0])); // Split each string and get the first part
    console.log(items);
  }
}
