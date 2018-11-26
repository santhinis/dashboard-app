/* Angular Imports */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
/* App Imports */
import { FixturesService } from '../../services/fixtures.service';
import { Fixture } from '../../models/fixture';
import { Token } from '../../models/token';
import { SnackbarService } from '../../services/snackbar.service';
import { Time } from '@angular/common';
import { isNumber, isDate } from 'util';
import { Configuration } from '../../services/configuration';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // CDN_LINK: string;
  fixtureList: Fixture[] = [];
  token : Token[] =[];
  allFixtures=[];
  selectedFixtures=[];
  selectedMatchIds=[];
  showNoMatchesMessage = '';
  selected: boolean;
  odds=0;
  from_date;
  to_date= new Date();
  stake_amount:Number;
  win_amount:Number;
  j_label:String;
  start_date;
  end_date:Date;
  start_time;
  end_time;
  no_of_matches:Number;
  today= '';
  status= 0;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  constructor(
    private fixturesService: FixturesService,
    public snackbarService: SnackbarService,
    private configuration: Configuration,
    private router:Router,
    private localStorageService:LocalStorageService
  ) {
    this.no_of_matches=3;
    this.j_label='Weekly';
    this.stake_amount= 100;
    this.win_amount = 100000;
    }

  ngOnInit() {
    let token = this.localStorageService.getStore();
    console.log(token);
    if (!token) {
      this.router.navigateByUrl('/');  
    }
    else
      this.configuration.setURL(token['environment']);
    this.setDate();
    this.fixturesService.fetchFixtures(this.from_date).subscribe(
      fixturesResp=>{
        this.allFixtures=fixturesResp;
        this.fixtureList= fixturesResp;
      },
      err =>console.log(err));
  }
  setDate(){
    //set date for current day!
    let today = new Date();    
    let date_in_json =(today.toJSON());
    this.today = date_in_json.split('T')[0];
    console.log(this.today);
    this.from_date = this.today;
    this.start_date = this.today;
    this.start_time ='00:00';
    this.end_time='00:00';
    
  }

  onChange(){
    this.fixtureList=[];
    this.fixturesService.fetchFixtures(this.from_date).subscribe(
      fixturesResp=>{
        this.allFixtures=fixturesResp;
        this.fixtureList= fixturesResp; 
      },
      err =>console.log(err));
  }

  onCheck(){
    this.status=this.status === 0 ? 1 : 0;
  }
  toggleSelection(match){
    for(let each of this.selectedFixtures){
      if (each.match_id == match.match_id) {
        each.selected= false;
        this.selectedMatchIds.splice(this.selectedFixtures.indexOf(each.match_id,1));
        this.selectedFixtures.splice(this.selectedFixtures.indexOf(each),1);
        this.calculateOdds();
        return;
      }
    }
      for(let each of this.fixtureList){
        if (each.match_id == match.match_id) {
          each.selected= true;
          this.selectedMatchIds.push(match.match_id);
          this.selectedFixtures.push(match);
          this.calculateOdds();
          
      }
    }
  }
  lowestOutcome(outcomes){
    let lowest = outcomes[0].points;
    outcomes.forEach(element => {
      if (element.points<lowest) {
        lowest = element.points;
      }
    });
    return lowest;
  }
  calculateOdds(){
    this.odds =1;
    this.selectedFixtures.forEach(element => {
      this.odds = this.odds * (1/this.lowestOutcome(element.match_odds.outcomes));
    });
  }

  onSave(){
    if (!this.configuration.token) {
      this.configuration.token = this.localStorageService.getStore();
    }
    if (this.j_label && this.configuration.token && this.start_date && this.end_date && this.start_time && this.end_time && this.win_amount && this.stake_amount && this.start_date && this.end_date && (this.selectedFixtures.length==this.no_of_matches) && this.selectedFixtures.length>0 && (this.start_date<=this.end_date)) {
          let question_identifiers='';
          this.selectedFixtures.forEach(element => {
            question_identifiers= question_identifiers+'1001%23'+element.match_odds.question_identifier.split('#')[1]+'%231001%232%231';
            if ((this.selectedFixtures.indexOf(element))!=(this.selectedFixtures.length-1)) {
              question_identifiers= question_identifiers+'&question_identifiers=';
            }
          });
          this.fixturesService.saveFixtures(this.configuration.token,this.j_label,this.win_amount,this.stake_amount,this.start_date,this.end_date,question_identifiers,this.status).subscribe(
            response=>{
              this.snackbarService.openSnackBar(response['description'],"Dismiss");
              this.newJackpotFix();            
            },err=>console.log(err)
          )
    }
    else
      this.handleError('','');
  }
  
  handleError(match,label){     
    if (!this.no_of_matches) {
      this.snackbarService.openSnackBar("Enter a match number.","Dismiss");
    }
    if (!isNumber(this.no_of_matches) && this.no_of_matches) {
      this.snackbarService.openSnackBar("Enter a valid match number.","Dismiss");
    }
    else if (!this.start_date) {
      this.snackbarService.openSnackBar("Enter a valid Jackpot start date","Dismiss");
    }
    else if (!this.end_date) {
      this.snackbarService.openSnackBar("Enter a valid Jackpot end date","Dismiss");
    }
    else if(this.start_date>this.end_date && this.start_date && this.end_date){
      this.snackbarService.openSnackBar("End date should be greater than start date","Dismiss");
    }
    else if (!this.start_time) {
      this.snackbarService.openSnackBar("Enter Jackpot start time","Dismiss");
    }
    else if (!this.end_time) {
      this.snackbarService.openSnackBar("Enter Jackpot end time","Dismiss");
    }
    else if(!this.no_of_matches){
      this.snackbarService.openSnackBar("Enter match number","Dismiss");
    }
    // if (match) {
    //   if(match.match_time.split('T')[0]< this.start_date || match.match_time.split('T')[0]> this.end_date)
    //     this.snackbarService.openSnackBar("Selected match dates outside bounds!","Dismiss");
    //   else if((match.match_time.split('T')[0]== this.start_date && match.match_time.split('T')[1]<=this.start_time)||(match.match_time.split('T')[0]== this.end_date && match.match_time.split('T')[1]>=this.end_time))
    //       this.snackbarService.openSnackBar("Selected match time outside bounds!","Dismiss");
    // }
      else if ((this.selectedFixtures.length)!=(this.no_of_matches)) {
        this.snackbarService.openSnackBar("Selected match number doesnt match the number of matches!","Dismiss");
      }
      else if (this.start_date>this.end_date) {
        this.snackbarService.openSnackBar("Enter the start date and end date correctly","Dismiss");
      }
      else if (!this.j_label){
        this.snackbarService.openSnackBar("Enter jackpot label","Dismiss");
      }
      else if(!isNumber(this.win_amount) && this.win_amount){
        this.snackbarService.openSnackBar("Enter a valid win amount","Dismiss");
      }
      else if(!isNumber(this.stake_amount) && this.stake_amount){
        this.snackbarService.openSnackBar("Enter a valid stake amount","Dismiss");
      }
      else if (!this.win_amount) {
        this.snackbarService.openSnackBar("Enter win amount","Dismiss");
      }
      else if (!this.stake_amount) {
        this.snackbarService.openSnackBar("Enter stake amount","Dismiss");
      }
      else if (!this.selectedFixtures.length) {
        this.snackbarService.openSnackBar("Select matches","Dismiss");
    }
  }
  logout(){
   this.localStorageService.removeStore();
   this.router.navigateByUrl('/');
  }
  newJackpotFix(){
    this.j_label='';
    this.win_amount=null;
    this.odds=0;
    this.stake_amount=null;
    this.start_date=null;
    this.end_date=null;
    this.start_time=null;
    this.end_time=null;
    this.to_date=null;
    this.from_date = null;
    this.end_date=null;
    this.no_of_matches=null;
    this.j_label=null;
    this.selectedFixtures=[];
    this.selectedMatchIds=[];
    this.allFixtures.forEach(element => {
      element.selected= false;
    });
    this.fixtureList= this.allFixtures;

  }
  clearSelected(){
    this.selectedFixtures=[];
    this.selectedMatchIds=[];
    this.allFixtures.forEach(element => {
      element.selected= false;
    });
    this.fixtureList= this.allFixtures;
    if (this.from_date||this.to_date) {
      this.onChange();
    }
   
  }
}