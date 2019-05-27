import { Component } from '@angular/core';

import { Menu } from './common/class/menu';
import { MENU } from './config/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kabiwo';
  isCollapsed = false;
  isReverseArrow = false;
  menu: Menu[] = MENU;
  mobileMenu: boolean = false;
  
  switch(): void {
    this.mobileMenu = !this.mobileMenu;
  }
}
