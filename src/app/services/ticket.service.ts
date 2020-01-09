import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { AppConfig } from './appConfig';
@Injectable({ providedIn: 'root' })
export class TicketService {
    

    constructor(private http: HttpClient) {
        
    }
    //add ration to the database using service
    bookTicket(postData) {

        return this.http.post<any>(`${AppConfig.API_URL}/api/v1/ticket`, postData);
    }
    
    //get list of all rations
    getBookedTickets() {

        return this.http.get<any>(`${AppConfig.API_URL}/api/v1/ticket`, {});
    }
    
    //delete any particular ration 
    deleteTicket(rationId){
        var data={id:rationId};
        return this.http.delete<any>(`${AppConfig.API_URL}/api/v1/ticket`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params: data
        });
    }

    enquireTicket(postData) {

        return this.http.post<any>(`${AppConfig.API_URL}/api/v1/myticket`, postData);
    }
    

}