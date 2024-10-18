import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private baseUrl = environment.backendUrl ;

  constructor(private http: HttpClient) { }

  get(url: string, params?: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + url, params)
  }

  post(url: string, params: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, params)
  }

  put(url: string, params: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + url, params)
  }

  delete(url: string, params: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + url, params)
  }
}
