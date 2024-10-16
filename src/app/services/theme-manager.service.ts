import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  private themeKey = 'THEME_COLOR';
  private defaultColor = '#8AAAE5'

  

  constructor() { }

  initializer(){
    const savedColor = localStorage.getItem(this.themeKey);
    if (savedColor) {
      this.setThemeColor(savedColor);
    } else {
      this.setThemeColor(this.defaultColor);
    }
  }




  setThemeColor(color: string) {
    document.documentElement.style.setProperty('--themeC', color);
    document.documentElement.style.setProperty('--themeC-rgb', this.hexToRGB(color));
    localStorage.setItem(this.themeKey, color);
  }

  private hexToRGB(hex: string): string {
    
    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `${r}, ${g}, ${b}`;
  }
}
