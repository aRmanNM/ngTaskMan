import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Task } from '../_models/Task';
import { NewTask } from '../_models/NewTask';

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  httpHeaders: HttpHeaders;
  baseUrl = environment.apiUrl + 'tasks';

  constructor(private http: HttpClient) {
    this.httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

  getTasks(isCompleted?: boolean, filter?: string) {
    let params = new HttpParams();

    if (isCompleted !== null) {
      params = params.append('isCompleted', isCompleted.toString());
    }

    if (filter !== '') {
      params = params.append('filter', filter);
    }

    return this.http.get<Task[]>(this.baseUrl, { headers: this.httpHeaders, params });
  }

  getUndoneTasks(filter?: string) {
    return this.getTasks(false, filter);
  }

  getDoneTasks(filter?: string) {
    return this.getTasks(true, filter);
  }

  doTask(task: Task) {
    task.isCompleted = true;
    return this.http.put(this.baseUrl + `/${task.id}`, task, { headers: this.httpHeaders });
  }

  updateTask(task: Task) {
    return this.http.put(this.baseUrl + `/${task.id}`, task, { headers: this.httpHeaders });
  }

  undoTask(task: Task) {
    task.isCompleted = false;
    return this.http.put(this.baseUrl + `/${task.id}`, task, { headers: this.httpHeaders });
  }

  addNewTask(newTask: NewTask) {
    return this.http.post(this.baseUrl, newTask, { headers: this.httpHeaders });
  }

  deleteTask(task: Task) {
    return this.http.delete(this.baseUrl + `/${task.id}`, { headers: this.httpHeaders });
  }
}
