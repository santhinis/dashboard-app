/* Angular Imports */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
/* App Imports */
import { FixturesService } from '../../services/fixtures.service';
import { Fixture } from '../../models/fixture';
import { Token } from '../../models/token';
import { SnackbarService } from '../../services/snackbar.service';
import { Time } from '@angular/common';
import { isNumber, isDate } from 'util';

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
  from_date:Date;
  to_date:Date;
  stake_amount:Number;
  win_amount:Number;
  j_label:String;
  start_date:Date;
  end_date:Date;
  start_time: Time;
  end_time: Time;
  no_of_matches:Number;
  today= '';
  status= 0;

  constructor(
    private fixturesService: FixturesService,
    public snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.setDate();
    this.fixturesService.fetchFixtures().subscribe(
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
  }

  onChange(){
    this.fixtureList=[];
    this.allFixtures.forEach(element => {
      if ((element.match_time.split('T')[0]>=this.from_date || (!this.from_date)) && (element.match_time.split('T')[0]<=this.to_date || (!this.to_date))) {
        this.fixtureList.push(element);
      }
    });
  }

  onCheck(){
    this.status=this.status===0?1:0;
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
    if (this.start_date && this.end_date && this.start_time && this.end_time) {
      for(let each of this.fixtureList){
        if (each.match_id==match.match_id) {
          // if((match.match_time.split('T')[0]> this.start_date && match.match_time.split('T')[0]< this.end_date) 
          // ||(match.match_time.split('T')[0]== this.start_date && this.start_date!==this.end_date && match.match_time.split('T')[1]>=this.start_time)
          // || (match.match_time.split('T')[0]== this.end_date && this.start_date!==this.end_date &&match.match_time.split('T')[1]<=this.end_time )
          // ||(match.match_time.split('T')[0]== this.start_date && this.start_date==this.end_date && match.match_time.split('T')[1]>=this.start_time &&match.match_time.split('T')[1]<=this.end_time)){
          each.selected= true;
          this.selectedMatchIds.push(match.match_id);
          this.selectedFixtures.push(match);
          this.calculateOdds();
        // }
        // else
        //   this.handleError(match,'');
      }
    }
    }
    else
      this.handleError('','toggle');
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
    if (this.j_label && isNumber(this.win_amount) && this.win_amount && isNumber(this.stake_amount) && this.stake_amount && this.start_date && this.end_date && (this.selectedFixtures.length==this.no_of_matches) && this.selectedFixtures.length>0 && (this.start_date<=this.end_date)) {
      this.fixturesService.getToken().subscribe(
        response=>{
          this.token= response;
          let token= 'Bearer '+this.token['access_token'];
          let question_identifiers='';
          this.selectedFixtures.forEach(element => {
            question_identifiers= question_identifiers+'1001%23'+element.match_odds.question_identifier.split('#')[1]+'%231001%232%231';
            if ((this.selectedFixtures.indexOf(element))!=(this.selectedFixtures.length-1)) {
              question_identifiers= question_identifiers+'&question_identifiers=';
            }
          });
          this.fixturesService.saveFixtures(token,this.j_label,this.win_amount,this.stake_amount,this.start_date,this.end_date,question_identifiers,this.status).subscribe(
            response=>{
              this.snackbarService.openSnackBar(response['description'],"Dismiss");
              this.newJackpotFix();            
            },err=>console.log(err)
          )
        },error=>console.log(error)
      );  
    }
    else
      this.handleError('','save');
  }
  
  handleError(match,label){     
    if (!isNumber(this.no_of_matches) && this.no_of_matches) {
      this.snackbarService.openSnackBar("Enter a valid match number.","Dismiss");
    }
    else if (this.no_of_matches>this.fixtureList.length){
      this.snackbarService.openSnackBar("Match number exceeded the limit","Dismiss");
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
    else if (this.selectedFixtures.length>this.no_of_matches) {
      this.snackbarService.openSnackBar("Selected match number doesnt match the number of matches!","Dismiss");
    }
    else if (this.selectedFixtures.length == this.no_of_matches) {
      this.snackbarService.openSnackBar("You cannot select anymore matches!","Dismiss");
    }
    // if (match) {
    //   if(match.match_time.split('T')[0]< this.start_date || match.match_time.split('T')[0]> this.end_date)
    //     this.snackbarService.openSnackBar("Selected match dates outside bounds!","Dismiss");
    //   else if((match.match_time.split('T')[0]== this.start_date && match.match_time.split('T')[1]<=this.start_time)||(match.match_time.split('T')[0]== this.end_date && match.match_time.split('T')[1]>=this.end_time))
    //       this.snackbarService.openSnackBar("Selected match time outside bounds!","Dismiss");
    // }
    if(label=='save'){
      if ((this.selectedFixtures.length)!=(this.no_of_matches)) {
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
      else if(label='toggle'){
        if (this.selectedFixtures.length>this.no_of_matches) {
          this.snackbarService.openSnackBar("Selected matches greater than match number!","Dismiss");
        }
    }
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
  }
}