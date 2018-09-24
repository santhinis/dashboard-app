import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable()
export class Configuration {
    private _solutionId = 1001; // Default Football
    private _apiServer: string;
    private _apiPath = '/cric/api/';
    constructor() {
        this._apiServer = environment.apiServerURL;
      }
    getSolutionID() {
        return this._solutionId;
      }
      getURL(): string {
        return this._apiServer + this._apiPath;
      }
}
