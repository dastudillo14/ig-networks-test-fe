import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobI, RequestJobApplyI, RequestJobI } from '../models/job.model';
import { ResultI } from '../models/result.model';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.API_URL + '/jobpost'; // Ajustar según la URL real de la API
  private apiUrlApply = environment.API_URL + '/application/';

  constructor(private http: HttpClient) { }


  getJobById(id: number): Observable<JobI> {
    return this.http.get<JobI>(`${this.apiUrl}/${id}/`);
  }

  searchJobs(page: number = 1, filters?: any): Observable<ResultI<JobI[]>> {
    let params = new HttpParams().set('page', page.toString());
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ResultI<JobI[]>>(`${this.apiUrl}/`, { params });
  }

  applyToJob(request: RequestJobApplyI): Observable<any> {
    return this.http.post(`${this.apiUrlApply}`, request);
  }

  createJob(job: RequestJobI): Observable<JobI> {
    return this.http.post<JobI>(`${this.apiUrl}/`, job);
  }

  updateJob(id: number, job: RequestJobI): Observable<JobI> {
    return this.http.put<JobI>(`${this.apiUrl}/${id}/`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
} 