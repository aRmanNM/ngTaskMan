import { Direction } from '@angular/cdk/bidi/directionality';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TaskManagerService } from 'src/app/_services/task-manager.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  showDoneTasks: boolean = false;
  rtl: Direction = 'rtl';
  newTask: any = {};

  @Input() doneTasks;
  @Input() undoneTasks;
  @Output() onDoTask = new EventEmitter<object>();
  @Output() onUndoTask = new EventEmitter<object>();
  @Output() onSelectTask = new EventEmitter<object>();
  @Output() onNewTask = new EventEmitter<any>();


  constructor(private taskManagerService: TaskManagerService) {}

  ngOnInit(): any {}

  doTask(task) {
    this.onDoTask.emit(task);
  }

  undoTask(task) {
    this.onUndoTask.emit(task);
  }

  editTask(task) {
    this.onSelectTask.emit(task);
  }

  toggleDoneTasks() {
    this.showDoneTasks = !this.showDoneTasks;
  }

  addNewTask() {
    if (this.newTask.title?.length > 0) {
      this.onNewTask.emit(this.newTask);
      this.newTask = {};
    }
  }

}
