import { Component, OnInit } from '@angular/core';
import { FixturesService } from '../../services/fixtures.service';
import { Configuration } from '../../services/configuration';
@Component({
  selector: 'app-jackpots',
  templateUrl: './jackpots.component.html',
  styleUrls: ['./jackpots.component.css']
})
export class JackpotsComponent implements OnInit {
  _environment='staging';
  createdJackpots=[];
  constructor(    
    private fixturesService: FixturesService,
    private configuration: Configuration
  ) { }

  ngOnInit() {
    this.setEnvironment();
  }

  onClick(){
    console.log("Radio is clicked!");
    console.log(this._environment);
    
    this.setEnvironment();
  }
  
  // Choose the environment staging or production!
  setEnvironment(){
    if (this._environment==='staging' ) {
      this.configuration.setURL('staging');
    }
    else if(this._environment==='production'){
      this.configuration.setURL('production');
    }
    this.getJackpots();
  }

  //fetch jackpots based on staging or production!
  getJackpots(){
    this.fixturesService.fetchJackpots().subscribe(
      jackpotResp =>{
        this.createdJackpots = jackpotResp;
        console.log( this.createdJackpots );   
      }
    )
  }

}
