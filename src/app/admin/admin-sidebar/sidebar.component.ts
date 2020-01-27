import { Component } from '@angular/core';

@Component({
  selector : 'app-admin-sidebar' ,
  templateUrl : './sidebar.component.html',
  styleUrls : ['./sidebar.component.css']
})
export class SidebarComponent {

  openNav() {
    console.log('in open nav ');
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
    document.body.style.background = 'rgba(0,0,0,0.4)';
    }
   closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
    document.body.style.backgroundColor = 'white';
  }

}
