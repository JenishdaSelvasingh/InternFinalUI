import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from '../services/asset.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-asset-dialog',
  templateUrl: './edit-asset-dialog.component.html',
  styleUrls: ['./edit-asset-dialog.component.css']
})
export class EditAssetDialogComponent implements OnInit {
  asset: any;

  constructor(
    public dialogRef: MatDialogRef<EditAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assetService: AssetService,
    private toastr: ToastrService
  ) {
    this.asset = { ...data.asset };
  }

  ngOnInit(): void {
    if (typeof this.asset.isActive === 'string') {
      this.asset.isActive = this.asset.isActive === 'true';
    }
  }
  

  onSubmit(): void {
    this.assetService.updateAsset(this.asset.id, this.asset).subscribe(
      () => {
        this.toastr.success('Asset updated successfully', 'Updated', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar:true,
        closeButton:true
        });
        this.dialogRef.close(true); 
      },
      (error) => {
        this.toastr.error('Failed to update asset', 'Error');
        console.error('Update asset error: ', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
