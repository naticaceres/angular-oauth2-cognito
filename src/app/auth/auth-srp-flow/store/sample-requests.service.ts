import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';

@Injectable({
  providedIn: 'root'
})
export class SampleRequestsService {
  constructor(private http: HttpClient) {}

  sampleRequest() {
    const url = environment.sampleRequest;
    return this.http.get(url);
  }
}
