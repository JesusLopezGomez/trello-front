import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmailService implements AsyncValidator{

  constructor(private http : HttpClient) { }
 
  private baseUrl : string = environment.urlUser;

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    return this.http.get<any>(`${this.baseUrl}/search?email=${control.value}`).pipe(
      map(resp => resp.id ? { emailTaken: true} : null),
      catchError(err => of(null))
    )
  }
}
