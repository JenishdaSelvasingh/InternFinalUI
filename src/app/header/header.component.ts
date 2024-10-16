import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeManagerService } from '../services/theme-manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isActiveLink = false;
  roleDisable: boolean = this.setVal();
  selectedTheme: string = '#D8EFD3';

  constructor(private router:Router, private authService:AuthServiceService,private themeService:ThemeManagerService) {
      this.router.events.subscribe((event)=>{
        if (event instanceof NavigationEnd) {
          this.isActiveLink = this.router.url === '/user-table-component';
        }
      });
   }

  ngOnInit(): void {
    this.themeService.initializer();
  }

  

  isDisabled(){
    return this.roleDisable;
  }

  changeColor(colorString:string){
    if(colorString == '#8AAAE5'){
      this.selectedTheme = '#8AAAE5';
    }else if(colorString=='#E7D4B5'){
      this.selectedTheme='#E7D4B5';
    }else if(colorString=='#FF90BC'){
      this.selectedTheme='#FF90BC';
    }
    this.themeService.setThemeColor(this.selectedTheme);
  }

  setVal(){
    const jwtHelper = new JwtHelperService();
    const accessToken = localStorage.getItem('accessToken') || "";
    const decodedToken = jwtHelper.decodeToken(accessToken);
    const accessTags = decodedToken.accessTags[0];
    return (accessTags === 'ADMINUSER');
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }


  onLogout(){
    console.log("logouttt")
    this.authService.logout();
    
  }

}
