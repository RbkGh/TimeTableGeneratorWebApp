import {Component, OnInit, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() userName: String;
  @Input() password: String;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  /**
   * todo router config to load particular url for login
   */
  login(): void {
    console.log("Username=" + this.userName + "password=" + this.password);
    this.router.navigate(['home']);
  }
}
