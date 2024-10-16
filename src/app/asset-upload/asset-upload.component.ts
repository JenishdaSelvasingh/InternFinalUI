import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AssetService } from '../services/asset.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-upload',
  templateUrl: './asset-upload.component.html',
  styleUrls: ['./asset-upload.component.css']
})
export class AssetUploadComponent implements OnInit{
     uploadForm!: FormGroup;
     assets: any;

     constructor(private fb: FormBuilder, 
                 private assetService: AssetService, 
                 private toastr: ToastrService,
                 private router: Router,
                 ) { 
                    this.uploadForm = this.fb.group({
                         assetID: [
                              '',
                              [
                                   Validators.required,
                                   Validators.minLength(5),
                                   Validators.maxLength(20),
                                   Validators.pattern(/^[a-zA-Z0-9]*$/)
                              ]
                         ]
                    });
                 }

     ngOnInit(): void {
         this.createForm();
         this.loadAssets();
     }

     createForm(): void {
          this.uploadForm = this.fb.group({
               assetID: ['', Validators.required],
               assetType: ['', Validators.required],
               assetModel: ['', Validators.required],
               isActive: ['', Validators.required],
               notes: ['', [Validators.minLength(6)]]
          });
     }

     get assetID() { return this.uploadForm.get('assetID'); }
     get assetType() { return this.uploadForm.get('assetType'); }
     get assetModel() { return this.uploadForm.get('assetModel'); }
     get isActive() { return this.uploadForm.get('isActive'); }
     get notes() { return this.uploadForm.get('notes'); }


     loadAssets() {
          this.assetService.getAllAssets().subscribe((resp: any) => {
               this.assets=resp;
               console.log(resp)
          }
     );
     }

     saveAssets() {
          if (this.uploadForm.valid) {
               const isActiveValue = this.uploadForm.get('isActive')?.value === 'yes';
               let requestBody = {
                    assetID: this.uploadForm.get('assetID')?.value,
                    assetType: this.uploadForm.get('assetType')?.value,
                    assetModel: this.uploadForm.get('assetModel')?.value,
                    isActive: isActiveValue,
                    notes: this.uploadForm.get('notes')?.value,
               };

               this.assetService.saveAssets(requestBody).subscribe(
                    (result: any) => {
                         this.toastr.success("Asset saved successfully", "Submitted", {
                              positionClass: 'toast-top-right',
                              timeOut: 3000,
                         });
                         console.log('Assets saved successfully', result);
                         this.uploadForm.reset();
                         this.uploadForm.markAsPristine();
                         this.uploadForm.markAsUntouched();
                         Object.keys(this.uploadForm.controls).forEach(key => {
                                this.uploadForm.get(key)?.setErrors(null);
                  });
                         this.loadAssets();
                    },
                    (error: any) => {
                         console.error('Error saving asset:', error);
                         this.toastr.error("Internal server error", "Error", {
                              positionClass: 'toast-top-right',
                              timeOut: 3000,
                         });
                    }
               );
          } else {
               this.toastr.warning("Please fill all required fields", "Warning", {
                 positionClass: 'toast-top-right',
                 timeOut: 3000,
               });
               console.log('Details are not valid');
             }
      }
     
      
      onSubmit(): void {
          if (this.uploadForm.valid) {
               console.log('Details submitted:', this.uploadForm.value);
          }
          else {
               console.log('Details are not valid');
          }
      }


        goBack(): void {
          this.router.navigate(['/paging']);
        }

        getErrorMessage() {
          if (this.assetID?.hasError('required')) {
            return 'You must enter a value';
          }
          if (this.assetID?.hasError('minlength')) {
               return 'Asset ID must be atleast 5 characters long';
          }
          if (this.assetID?.hasError('maxlength')) {
               return 'Asset ID cannot be more than 20 characters long';
          }
          if (this.assetID?.hasError('pattern')) {
               return 'Asset ID cannot contain special characters';
          }
          return '';
        }
}
