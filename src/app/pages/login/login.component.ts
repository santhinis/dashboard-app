import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../services/configuration';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  clientID:string;
  clientSecret:string;
  environment='staging';
  constructor(
    private configuration:Configuration,
  ) { }

  ngOnInit() {}

  onSave(){
    this.configuration.setURL(this.environment);
    this.configuration.clientID= this.clientID;
    this.configuration.clientSecret = this.clientSecret;
  }
}
