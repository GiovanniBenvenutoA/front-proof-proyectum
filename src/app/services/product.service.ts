import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product';
import { PageResponse } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private readonly baseUrl = 'http://localhost:8080/api-product-proyectum/api/v1/products';
  private readonly baseUrlLogin = 'http://localhost:8080/api-product-proyectum';

  constructor(private http: HttpClient) { }




  token(username: string, password: string): Observable<any> {
    const url = `${this.baseUrlLogin}/auth/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };
    return this.http.post<{ token: string }>(url, body, { headers }).pipe(
      tap(resp => {
        localStorage.setItem('jwt', resp.token);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Authorization':`${token}`
    });
  }



  list(q = '', page = 0, size = 10, sort = 'id,desc'): Observable<PageResponse<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (q?.trim()) params = params.set('q', q.trim());
    return this.http.get<PageResponse<Product>>(this.baseUrl, { headers: this.getAuthHeaders(), params });
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(p: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, p, { headers: this.getAuthHeaders() });
  }

  update(id: number, p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, p, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
