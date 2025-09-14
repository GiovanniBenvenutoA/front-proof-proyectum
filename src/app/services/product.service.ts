import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { PageResponse } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8080/api-product-proyectum/api/v1/products'; // ajusta si usas proxy

  constructor(private http: HttpClient) {}

  list(q = '', page = 0, size = 10, sort = 'id,desc'): Observable<PageResponse<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (q?.trim()) params = params.set('q', q.trim());
    return this.http.get<PageResponse<Product>>(this.baseUrl, { params });
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(p: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, p);
  }

  update(id: number, p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
