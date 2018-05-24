import { Injectable } from '@angular/core';
import {Http,Headers,RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class GoodzerService {
     constructor(private http: Http) { 
       
   }

   searchLocations(searchText:string,latitude:string,longitude:string) : Observable<any>
   {
        let headers: Headers = new Headers();
   headers.append('Accept', 'application/json');
   headers.append('Content-Type', 'application/json');
   headers.append('Access-Control-Allow-Origin', '*');

   let options = new RequestOptions({
     headers: headers
   });

  
       
       return this.http.get(AppSettings.GOODZER_API_ENDPOINT
         +'/search_locations/?query='+
         searchText+
         '&lat='+latitude+'&lng='+longitude+'&radius=5.0&apiKey='+AppSettings.GOODZER_API_KEY,options)
            .map((response: Response) => {
                //console.log(response);
                return response.json();
            }).catch(this.handleError);
   }

   searchStores(searchText:string,latitude:string,longitude:string) : Observable<any>
   {
        let headers: Headers = new Headers();
   headers.append('Accept', 'application/json');
   headers.append('Content-Type', 'application/json');
   headers.append('Access-Control-Allow-Origin', '*');

   let options = new RequestOptions({
     headers: headers
   });

  
       
       return this.http.get(AppSettings.GOODZER_API_ENDPOINT
         +'/search_stores/?query='+
         searchText+
         '&lat='+latitude+'&lng='+longitude+'&radius=5.0&apiKey='+AppSettings.GOODZER_API_KEY,options)
            .map((response: Response) => {
                
                return response.json();
            }).catch(this.handleError);
   }

   searchInStores(searchText:string,storeId:string) : Observable<any>
   {
        let headers: Headers = new Headers();
   headers.append('Accept', 'application/json');
   headers.append('Content-Type', 'application/json');
   headers.append('Access-Control-Allow-Origin', '*');

   let options = new RequestOptions({
     headers: headers
   });

  
       
       return this.http.get(AppSettings.GOODZER_API_ENDPOINT
         +'/search_in_store/?query='+
         searchText+
         '&storeId='+storeId+'&apiKey='+AppSettings.GOODZER_API_KEY,options)
            .map((response: Response) => {
                console.log(response);
                return response.json();
            }).catch(this.handleError);
   }

   private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }else {
          errMsg = error.message ? error.message : error.toString();
        }
        //console.log(error);
        return Observable.throw(errMsg);
    }

}