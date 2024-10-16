import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FormComponentComponent } from './form-component/form-component.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';
import { NewTableComponent } from './new-table/new-table.component';
import { HeaderUserComponent } from './header-user/header-user.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { ReqManageComponent } from './req-manage/req-manage.component';
import { RolePageComponent } from './role-page/role-page.component';
import { ResetReqComponent } from './reset-req/reset-req.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AssetUploadComponent } from './asset-upload/asset-upload.component';
import { PagingserverComponent } from './pagingserver/pagingserver.component';


const routes: Routes = [
  {path: 'header-component', component:HeaderComponent,canActivate:[AuthGuard]},
  {path: 'user-table-component', component:UserTableComponent,canActivate:[AuthGuard]},
  {path: 'form-component-component', component:FormComponentComponent,canActivate:[AuthGuard]},
  {path: 'alert-component', component:AlertBoxComponent},
  {path: 'confirm-mail', component:ConfirmMailComponent},
  {path: 'login', component:LoginPageComponent},
  {path: 'new-table-component', component:NewTableComponent,canActivate:[AuthGuard]},
  {path: 'user-header-component', component:HeaderUserComponent,canActivate:[AuthGuard]},
  {path: 'view-table-component', component:ViewTableComponent,canActivate:[AuthGuard]},
  {path: 'app-req-component', component:ReqManageComponent,canActivate:[AuthGuard]},
  {path: 'role-component', component:RolePageComponent,canActivate:[AuthGuard]},
  // {path: 'rest-page', component:ResetPageComponent},
  {path: 'rest-req', component:ResetReqComponent},
  { path: 'upload', component: AssetUploadComponent, canActivate: [AuthGuard] },
  { path: 'paging', component: PagingserverComponent, canActivate: [AuthGuard] },
  {path: '', component:LoginPageComponent},
  { path: '**', pathMatch: 'full',  
    component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
