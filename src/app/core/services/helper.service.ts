import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultI } from '../models/result.model';
import { environment } from '../../../environments/environment';
import { StatusI } from '../models/status.model';
import { CategoryI } from '../models/category.model';



@Injectable({
    providedIn: 'root'
})
export class HelperService {

    private apiUrlStatus = environment.API_URL + '/status'; // Ajustar según la URL real de la API
    private apiUrlCategory = environment.API_URL + '/category'; // Ajustar según la URL real de la API
    constructor(private http: HttpClient) { }

    getStatusList(): Observable<ResultI<StatusI[]>> {
        return this.http.get<ResultI<StatusI[]>>(this.apiUrlStatus);
    }

    getCategories(): Observable<ResultI<CategoryI[]>> {
        return this.http.get<ResultI<CategoryI[]>>(this.apiUrlCategory);
    }


} 