// Third party imports go here
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// application imports go here
import { Configuration } from './configuration';
import { Fixture } from '../models/fixture';
import { Token } from '../models/token';

@Injectable()
export class FixturesService {
  constructor(
    private http: HttpClient,
    private appConfig: Configuration,
  ) {}

  fetchFixtures(from_date) {
    let fixturesURL = this.appConfig.getURL() + 'fixtures/get?&solution_id=1001&page_size=300&from_date='+from_date;
    return this.http.get<Fixture[]>(fixturesURL);
  }
  getToken(){
    let tokenUrl= this.appConfig.getURL()+'o/token/';
    let headers = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded;charset=utf-8',
        'Accept' : '*/*'
      })
    };
    console.log(headers.headers);
    // 22aMAv02a0AfkueS9fN0GqxNrpXX8MzXx6iT5ng2
    // 9XE89EG1Y9DVq3Qb9NblosisrAy3l9rtoltcFk9NPKMYeGrXuP1VD7UtmmsB4BLo6TTal6EV9EnT8zM08esuOi8XGoXEUrzP07jGDaL9FANp8DBj05LwlEqtZZwjYFrj

    let body = "grant_type=client_credentials&client_id="+this.appConfig.clientID+"&client_secret="+this.appConfig.clientSecret;
    return this.http.post<Token[]>(tokenUrl,body,headers);
  }
  saveFixtures(token,j_label,win_amount,stake_amount,start_date,end_date,question_identifiers,status){
    let saveUrl = this.appConfig.getURL()+'dashboard/jackpot/save';
    let data = 'label='+j_label+'&status='+status+'&stake_amount='+stake_amount+'&win_amount='+win_amount+'&start_date='+start_date+'%2000%3A00%3A00&end_date='+end_date+'%2000%3A00%3A00&question_identifiers='+question_identifiers; 
    console.log(data);
    console.log(token['token']);
    
    
    let headers = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': token['token']
      })
    };
    return this.http.post(saveUrl,data,headers);
  }
  fetchJackpots() {
    const jackpotUrl = this.appConfig.getURL() + 'jackpots/get';
    return this.http.get<any[]>(jackpotUrl);
  }

}
