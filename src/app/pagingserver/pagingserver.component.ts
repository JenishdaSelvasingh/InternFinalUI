import { Component, ViewEncapsulation } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { EditAssetDialogComponent } from '../edit-asset-dialog/edit-asset-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogDeleteAllComponent } from '../confirm-dialog-delete-all/confirm-dialog-delete-all.component';
import { ChangeDetectorRef } from '@angular/core';

interface Asset {
  assetID: string;
  assetType: string;
  assetModel: string;
  notes: string;
  isActive: boolean;
  dateCreated: string;
  lastUpdated: string;
}


@Component({
  selector: 'app-pagingserver',
  templateUrl: './pagingserver.component.html',
  styleUrls: ['./pagingserver.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PagingserverComponent {
  page: number = 0;
  size: number = 10;
  rows: any = [];
  totall: number = 0;
  allSelected: boolean = false;
  selected: Asset[] = [];
  spinnerName = 'display-spinner';

  columns = [
    { name: 'Asset ID', prop: 'assetID' },
    { name: 'Asset Type', prop: 'assetType' },
    { name: 'Asset Model', prop: 'assetModel' },
    { name: 'Notes', prop: 'notes' },

  ];
  
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(private assetService: AssetService, 
              public dialog: MatDialog, 
              private toastr: ToastrService, 
              private router: Router,
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private ref: ChangeDetectorRef)
               {}

  ngOnInit() {
    this.loadPage();
    localStorage.removeItem('page');
    localStorage.setItem('page','assetPage');
  }

  loadPage() {
    this.assetService.getResults(this.page, this.size).subscribe(pagedData => {
      this.rows = pagedData.content;
      this.filteredRows =this.rows
      this.totall = pagedData.totalElements;
      console.log(this.rows);
    });
  }

  onPageChange(event: any) {
    this.page = event.offset;
    this.loadPage();
  }


  editRow(row: any) {
    this.spinner.show(this.spinnerName);

        setTimeout(() => {
          this.spinner.hide(this.spinnerName);
        }, 3000);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = { asset: row };
  
    const dialogRef = this.dialog.open(EditAssetDialogComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPage(); 
      }
    });
  }

  
deleteAsset(row: any) {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.assetService.deleteAsset(row.id).subscribe(response => {
            if(response ){
              this.toastr.success("Asset deleted successfully", "Deleted");
              console.log(response);
              this.loadPage(); 
            }
           
          }, error => {
              this.toastr.error("Unable to delete", "Not delete");
          });
      }
  });
}

searchFilterInput: string = '';
searchAttributes: string[] = [];
filteredRows: any = [];

searchFilter(value: string) {
  const filterValue = value ? value.toLowerCase() : '';

  if (this.searchAttributes.length === 0) {
    this.filteredRows = this.rows.filter((asset: any) => {
      return Object.keys(asset).some(key => {
        const assetValue = asset[key];
        return assetValue ? assetValue.toString().toLowerCase().includes(filterValue) : false;
      });
    });
  } else {
    this.filteredRows = this.rows.filter((asset: any) => {
      return this.searchAttributes.some(attr => {
        const assetValue = asset[attr];
        return assetValue ? assetValue.toString().toLowerCase().includes(filterValue) : false;
      });
    });
  }
}

clearSearchInput() {
  this.searchFilterInput = '';
  this.filteredRows = this.rows;
}

onSelect({ selected }: { selected: any[] }) {
  console.log('Select Event', selected, this.selected);

  this.selected.splice(0, this.selected.length);
  this.selected.push(...selected);
}


logout() {
  localStorage.removeItem('token');
  this.authService.isAuthenticated = false;
  this.router.navigate(['/']);
}

deleteAll() {

  const dialogRef = this.dialog.open(ConfirmDialogDeleteAllComponent, {
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.toastr.success("Asset deleted successfully", "Deleted");
          this.assetService.deleteAll().subscribe(response => {
              console.log(response);
              this.loadPage(); 
          }, error => {
              console.error('Error deleting asset:', error);
          });
      }
  });
}

triggerFileInput() {

  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

onFileSelected(event: any) {
  const files: FileList = event.target.files;
  if (files.length > 0) {
    this.uploadFiles(files);
  }
}

uploadFiles(files: FileList) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }

  this.assetService.bulkUpload(formData).subscribe(
    (result: any) => {
        if(result && result.status === true){
          this.toastr.success(result.message, 'Success', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
          });
          this.loadPage();
        } else {
          this.toastr.error(result.message, 'Error', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
          });
        }
    },
    (error: any) => {
      console.error('Error uploading assets:', error);
      this.toastr.error('Error uploading assets', 'Error', {
        positionClass: 'toast-top-right',
        timeOut: 3000,
      });
    }
  );
}

onGetRowClass = (row: any, rowIndex: number) => {
  return rowIndex % 2 === 0 ? 'blueRow' : 'whiteRow';
}


}
