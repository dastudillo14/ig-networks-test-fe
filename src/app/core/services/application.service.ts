import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResultI } from '../models/result.model';
import { ApplicationI } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.API_URL}/application`;

  constructor(private http: HttpClient) { }

  getApplications(page: number = 1, filters?: any): Observable<ResultI<ApplicationI[]>> {
    let httpParams = new HttpParams().set('page', page.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          httpParams = httpParams.set(key, filters[key]);
        }
      });
    }

    return this.http.get<ResultI<ApplicationI[]>>(this.apiUrl, { params: httpParams });
  }

  getApplicationById(id: string): Observable<ApplicationI> {
    return this.http.get<ApplicationI>(`${this.apiUrl}/${id}`);
  }

  updateApplicationStatus(id: string, status: string): Observable<ApplicationI> {
    return this.http.patch<ApplicationI>(`${this.apiUrl}/${id}/status`, { status });
  }
}
