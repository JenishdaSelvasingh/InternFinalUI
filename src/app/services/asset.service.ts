import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = 'http://localhost:8080/api';


  constructor(private http: HttpClient) {}

  getAllAssets() {
    return this.http.get(this.apiUrl+"/data");
  }

  saveAssets(asset: any): Observable<any> {
    const url = `${this.apiUrl}/saveAsset`;
    return this.http.post(url, asset);
  }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/data`);
  }

  getResults(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/pagedata?page=${pageNumber}&size=${pageSize}`);
  }

  deleteAsset(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }

  updateAsset(id: string, asset: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, asset);
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/signin`, { email, password });
  // }

  // signup(name: string, email: string, password: string, role: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/signup`, {name, email, password, role});
  // }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAll`, { responseType: 'text'});
  }

  bulkUpload(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'authorization': `${localStorage.getItem('accessToken')}`
    });
    return this.http.post(`${this.apiUrl}/bulkUpload`, formData, { headers });
  }


  // forgotPassword(email: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/forgotpassword`, { email });
  // }

  // verifyOtp(email: string, otp: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/verifyotp`, { email, otp });
  // }

  // changePassword(email: string, otp: string, newPassword: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/changepassword`, { email, otp, newPassword });
  // }
  
}
