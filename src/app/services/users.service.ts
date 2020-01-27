import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import {HttpClient} from '@angular/common/http';
@Injectable ({
providedIn: 'root'

})
export class UserService {

constructor(private http: HttpClient) {}
createuser(name: string , email: string , password: string) {
const user: User = { _id: null , name ,  email , password, type: '0'};
this.http.post<{userid: string}> ('http://localhost:3000/create/user', user).subscribe(
  (responsedata) => {
    console.log(' saved correctly' + responsedata.userid);
  }
);
}
}
