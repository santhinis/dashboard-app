import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    private _solutionId = 1001; // Default Football
    private _apiServer: string;
    private _apiPath = '/cric/api/';
    public clientID: string;
    public clientSecret:string;
    constructor() {
      }
    setURL(envmt){
      if (envmt == 'staging') {
        console.log("insde staging");
        this._apiServer = 'https://api.sportsliv.com';
      }
      else if (envmt == 'production') {
        console.log("production");
        this._apiServer ='https://api.sports.bigpesa.com';
      }
    }
    getSolutionID() {
        return this._solutionId;
      }
      getURL(): string {
        return this._apiServer + this._apiPath;
      }
}
