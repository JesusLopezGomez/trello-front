import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  private baseUrl : string = environment.urlBoard;

  getBoardsByProjects(idProject:number):Observable<Board[]>{
    return this.http.get<Board[]>(`${this.baseUrl}/byProject/${idProject}`);
  }

  save(nameAndIdProject:any):Observable<Board>{
    return this.http.post<Board>(`${this.baseUrl}/add`,nameAndIdProject);
  }

  delete(idBoard:number):Observable<Board>{
    return this.http.delete<Board>(`${this.baseUrl}/delete/${idBoard}`);
  }
}
