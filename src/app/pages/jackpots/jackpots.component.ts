import { Component, OnInit } from '@angular/core';
import { FixturesService } from '../../services/fixtures.service';
@Component({
  selector: 'app-jackpots',
  templateUrl: './jackpots.component.html',
  styleUrls: ['./jackpots.component.css']
})
export class JackpotsComponent implements OnInit {

  createdJackpots=[];
  constructor(    
    private fixturesService: FixturesService
  ) { }

  ngOnInit() {
    this.fixturesService.fetchJackpots().subscribe(
      jackpotResp =>{
        this.createdJackpots = jackpotResp;
        console.log( this.createdJackpots );
        
      }
    )
  }

}
