import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  setStore(sportsieStore: any) {
    try {
      console.log("inside");
      localStorage.setItem('token', JSON.stringify(sportsieStore));
    } catch (e) {
      console.log(e);
    }
  }
  getStore() {
    try {
      const cleverCricket = JSON.parse(localStorage.getItem('token'));
      return cleverCricket;
    } catch (e) {
      console.log(e);
    }
  }
  removeStore(){
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.log(e);
    }
  }
}
