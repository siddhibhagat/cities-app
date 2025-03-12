import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  apiURL: string = environment.domain || "http://localhost:4000";

  constructor(
    private http: HttpClient
  ) { }

  getAllCities(queryParams: { term: string, page: number, limit: number }): Observable<{ data: City[], totalRecords: number }> {
    return this.http.get<{ data: City[], totalRecords: number }>(`${this.apiURL}/api/cities/search`, { params: queryParams });
  }
}
