import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private formData = new BehaviorSubject<any>(null);
  formData$ = this.formData.asObservable();
  
  constructor(private http: HttpClient) {}

  getForms(page: number, size: number): Observable<any> {
   
    const url = `http://localhost:8080/data?page=${page}&size=${size}`;
    console.log(url)
    return this.http.get<any>(url);
  }

  getRoles(){
    const url = `http://localhost:8080/getRoles`;
    console.log(url)
    return this.http.get<any>(url);
  }


  getRequests(): Observable<any> {
   
    const url = `http://localhost:8080/getReq`;
    console.log(url)
    return this.http.get<any>(url);
  }

  getIds(): Observable<any> {
   
    const url = `http://localhost:8080/api/listid`;
    console.log(url)
    return this.http.get<any>(url);
  }

  getTypes(): Observable<any> {
   
    const url = `http://localhost:8080/api/listType`;
    console.log(url)
    return this.http.get<any>(url);
  }

  getLogs(): Observable<any> {
   
    const url = `http://localhost:8080/logs?`;
    console.log(url)
    return this.http.get<any>(url);
  }




  getUserId(): Observable<any> {
    const url = `http://localhost:8080/getUser`;
    console.log(url)
    return this.http.get<any>(url);
  }

  acceptRequest(bodyData: { ntId: string, itemType: string }): Observable<any> {
    const url = 'http://localhost:8080/acceptReq';
    return this.http.post<any>(url, bodyData, { responseType: 'text' as 'json' });
  }

  

  // searchForms(page: number, size: number, searchTerm: string ): Observable<any> {
   
  //   const url = `http://localhost:8080/search?page=${page}&size=${size}&search=${searchTerm}`;
  //   console.log(url)
  //   return this.http.get<any>(url);
  // }


  // searchKeyForms(page: number, size: number, searchKey: string, searchTerm:string ): Observable<any> {
   
  //   const url = `http://localhost:8080/searchKey?page=${page}&size=${size}&search=${searchTerm}&key=${searchKey}`;
  //   console.log(url)
  //   return this.http.get<any>(url);
  // }

  // searchAny(page: number, size: number, searchKey: string, searchTerm:string ): Observable<any> {
   
  //   const url = `http://localhost:8080/searchAny?page=${page}&size=${size}&search=${searchTerm}&key=${searchKey}`;
  //   console.log(url)
  //   return this.http.get<any>(url);
  // }

  searchForms(page: number, size: number, searchTerm: string, sort:string, direction:string ): Observable<any> {
    const url = `http://localhost:8080/search?page=${page}&size=${size}&search=${searchTerm}&sort=${sort}&sortDir${direction}`;
    console.log(url)
    return this.http.get<any>(url);
  }
  searchKeyForms(page: number, size: number, searchKey: string, searchTerm:string, sort:string, direction:string ): Observable<any> {
    const url = `http://localhost:8080/searchKey?page=${page}&size=${size}&search=${searchTerm}&key=${searchKey}&sort=${sort}&sortDir${direction}`;
    console.log(url)
    return this.http.get<any>(url);
  }
  searchAny(page: number, size: number, searchKey: string[], searchTerm:string, sort:string, direction:string ): Observable<any> {
    const url = `http://localhost:8080/searchAny?page=${page}&size=${size}&search=${searchTerm}&key=${searchKey}&sort=${sort}&sortDir${direction}`;
    console.log(url)
    return this.http.get<any>(url);
  }


  
  setFormData(data: any) {
    this.formData.next(data);
  }

  
  
  fetchData(pageNumber: number, pageSize: number, sort: string, direction: string): Observable<any> {
  let params = new HttpParams()
    .set('page', pageNumber.toString())
    .set('size', pageSize.toString())
    .set('sort', sort)
    .set('sortDir', direction);
  return this.http.get<any>('http://localhost:8080/users', { params });
}



getLogsSort(): Observable<any> {


    return this.http.get<any>('http://localhost:8080/logsSort');
}

}
