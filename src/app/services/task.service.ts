import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Task } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  private baseUrl : string = environment.urlTask;

  update(task:Task):Observable<Task>{
    return this.http.put<Task>(`${this.baseUrl}/update/${task.id}`,task)
  }

  orderTasks(tasks:Task[]):void{
    this.http.post(`${this.baseUrl}/orderTasks`,tasks).subscribe();
  }
}
