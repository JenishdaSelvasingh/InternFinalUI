import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FormComponentComponent } from './form-component/form-component.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; 
import { UpdateComponent } from './update/update.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AlertModule } from './_alert';
import { DialogConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { ConfirmBoxConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { ToastNotificationConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { provideNgVibeToastify } from '@ng-vibe/toastify';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import {NgConfirmModule} from 'ng-confirm-box';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CustomInterceptorService } from './services/custom.interceptor.service';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';
import { NewTableComponent } from './new-table/new-table.component';
import { HeaderUserComponent } from './header-user/header-user.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { ReqManageComponent } from './req-manage/req-manage.component';
import { RolePageComponent } from './role-page/role-page.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { ResetPageComponent } from './reset-page/reset-page.component';
import { ResetReqComponent } from './reset-req/reset-req.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import SlackNotify from 'slack-notify';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { AssetUploadComponent } from './asset-upload/asset-upload.component';
import { PagingserverComponent } from './pagingserver/pagingserver.component';
import { EditAssetDialogComponent } from './edit-asset-dialog/edit-asset-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogDeleteAllComponent } from './confirm-dialog-delete-all/confirm-dialog-delete-all.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserTableComponent,
    FormComponentComponent,
    UpdateComponent,
    AlertBoxComponent,
    LoginPageComponent,
    ConfirmMailComponent,
    NewTableComponent,
    HeaderUserComponent,
    ViewTableComponent,
    ReqManageComponent,
    RolePageComponent,
    CreateAdminComponent,
    ResetPageComponent,
    ResetReqComponent,
    PagenotfoundComponent,
    AssetUploadComponent,
    PagingserverComponent,
    EditAssetDialogComponent,
    ConfirmDialogComponent,
    ConfirmDialogDeleteAllComponent,
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    AppRoutingModule,
    NgxDatatableModule,
    NgConfirmModule,
    HttpClientModule,
    FormsModule,
    AlertModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatTooltipModule,
    MatRadioModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    BrowserAnimationsModule,
    DialogConfigModule.forRoot(),
    ConfirmBoxConfigModule.forRoot(),
    ToastNotificationConfigModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar:true,
      closeButton:true
    }),
  ],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // AssetService,
    // { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', floatLabel: 'always' } },
    // { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'blue' } },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: CustomInterceptorService,
    multi: true
  },
  [provideNgVibeToastify(),ToastifyRemoteControl],[AuthGuard]
] ,
  bootstrap: [AppComponent],
})
export class AppModule { }