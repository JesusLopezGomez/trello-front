import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class projectService {

  constructor(private http: HttpClient) { }

  private baseUrl : string = environment.urlProject;

  getProjectsByIdUser(idUser:number):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.baseUrl}/user/${idUser}`);
  }

  getById(idProject : number):Observable<Project>{
    return this.http.get<Project>(`${this.baseUrl}/search/${idProject}`);
  }

  updateProject(project:Project):Observable<Project>{
    return this.http.put<Project>(`${this.baseUrl}/update/${project.id}`,project);
  }

  deleteProject(project:Project):Observable<Project>{
    return this.http.delete<Project>(`${this.baseUrl}/delete/${project.id}`);
  }

  saveProject(nameAndDescription:any):Observable<Project>{
    return this.http.post<Project>(`${this.baseUrl}/add`,nameAndDescription);
  }
}
