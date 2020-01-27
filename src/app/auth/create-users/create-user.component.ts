import {Component} from '@angular/core';
import { UserService } from '../../services/users.service';
import { NgForm } from '@angular/forms';

@Component ( {
 selector : 'app-create-user',
 templateUrl : './create-user.component.html',
 styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  errorFlag = 0;
  constructor(public userService: UserService) {}
onCreateUser(userform: NgForm) {
  if (userform.invalid ) {
    return ;
  } else if (userform.value.password !== userform.value.reenterpassword) {
    this.errorFlag = 1;
    return;
  }
  this.userService.createuser(userform.value.username, userform.value.email, userform.value.password);

}

}
