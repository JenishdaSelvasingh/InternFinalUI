import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  isActiveLink = true;
  

  constructor(private router:Router, private authService:AuthServiceService) {
      this.router.events.subscribe((event)=>{
        if (event instanceof NavigationEnd) {
          this.isActiveLink = this.router.url === '/new-table-component';
        }
      });
   }

  ngOnInit(): void {
  }

  isActive(path:string):boolean{
    return this.router.url==path;
  }


  onLogout(){
    console.log("logouttt")
    this.authService.logout();
    
  }
}
