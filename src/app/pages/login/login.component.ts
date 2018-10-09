import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../services/configuration';
import { LocalStorageService } from '../../services/local-storage.service';
import { FixturesService } from '../../services/fixtures.service';
import { Token } from '../../models/token';
import { Router } from '@angular/router';
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
    private localStorageService:LocalStorageService,
    private fixturesService: FixturesService,
    private router: Router
  ) { }

  ngOnInit() {
    
}
ngDoCheck(): void {
  let token =this.localStorageService.getStore();
    if (token) {
      this.router.navigateByUrl('/home');  
    }
}

  onSave(){
    this.configuration.setURL(this.environment);
    this.configuration.clientID= this.clientID;
    this.configuration.clientSecret = this.clientSecret;
    this.getToken()
  }
  getToken(){
    this.fixturesService.getToken().subscribe(
      response=>{
        let _token= response;
        let token= 'Bearer '+_token['access_token'];
        let Token ={'token':token,
      'environment':this.environment}
        this.localStorageService.setStore(Token);
  },err=>console.log(err)
)
}
}
