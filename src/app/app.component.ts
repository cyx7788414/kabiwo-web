import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kabiwo';
  isCollapsed = false;
  isReverseArrow = false;
  mobileMenu: boolean = false;
  
  switch(): void {
    console.log(this.isCollapsed)
    this.mobileMenu = !this.mobileMenu;
  }
}
