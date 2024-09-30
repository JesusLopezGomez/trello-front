import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User, UserRegister } from '../interfaces/interfaces';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private baseUrl : string = environment.urlUser;

  public username = signal("");
  public role = signal("");

  save(user : UserRegister): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/register`,user);
  }

  newToken(resp:any){
    localStorage.setItem('token', resp.token)
  }

  renew(){
      const token = localStorage.getItem('token');
      if(token){
        const decoded = jwtDecode(token) as any
        this.username.update(() => decoded.sub);
        this.role.update(() => decoded.role);
      }
    }

  login(usernameAndPassword:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`,usernameAndPassword)
    .pipe(
      tap(resp => this.newToken(resp)),
      map(resp => true),
      catchError(error => of(error.error.messages))
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.username.update(() => "");
    this.role.update(() => "");
  }

  searchUser(username:string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/search?username=${username}`);
  }
}

