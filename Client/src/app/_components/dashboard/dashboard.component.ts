import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TaskManagerService } from 'src/app/_services/task-manager.service';
import { Direction } from '@angular/cdk/bidi/directionality';
import { MediaMatcher } from '@angular/cdk/layout';
import { Task } from 'src/app/_models/Task';
import { NewTask } from 'src/app/_models/NewTask';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, DoCheck {
  rtl: Direction = 'rtl';
  ltr: Direction = 'ltr';
  taskToEdit: Task;
  jwtHelper = new JwtHelperService();
  doneTasks: Task[];
  undoneTasks: Task[];
  sidebarToggleFlag = false;
  mobileQuery: MediaQueryList;
  filter = '';

  private _mobileQueryListener: () => void;

  constructor(
    private authService: AuthService,
    private taskManagerService: TaskManagerService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    this.refreshTasks();
  }

  ngDoCheck() {
    if (this.sidebarToggleFlag === false && this.taskToEdit) {
      this.updateTask(this.taskToEdit);
      this.taskToEdit = undefined;
    }
  }

  ngOnDestroy(): void {
    this.doneTasks = null;
    this.undoneTasks = null;
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.authService.logout();
  }

  getDoneTasks() {
    this.taskManagerService.getDoneTasks(this.filter).subscribe((res) => {
      this.doneTasks = res;
    });
  }

  getUndoneTasks() {
    this.taskManagerService.getUndoneTasks(this.filter).subscribe((res) => {
      this.undoneTasks = res;
    });
  }

  doTask(task) {
    this.taskManagerService.doTask(task).subscribe(() => {
      this.refreshTasks();
    });
  }

  undoTask(task) {
    this.taskManagerService.undoTask(task).subscribe(() => {
      this.refreshTasks();
    });
  }

  toggleEditSidebar(task) {
    this.taskToEdit = task;
    this.sidebarToggleFlag = true;
  }

  deleteTask() {
    this.taskManagerService.deleteTask(this.taskToEdit).subscribe(() => {
      this.taskToEdit = undefined;
      this.refreshTasks();
    });
  }

  updateTask(task: Task) {
    this.taskManagerService.updateTask(task).subscribe(() => {
      this.refreshTasks();
    });
  }

  addNewTask(newTask: NewTask) {
    newTask.description = '';
    this.taskManagerService.addNewTask(newTask).subscribe(() => {
      this.refreshTasks();
    });
  }

  filterResult(query) {
    this.filter = query;
    this.refreshTasks();
  }

  refreshTasks() {
    this.getDoneTasks();
    this.getUndoneTasks();
  }
}
