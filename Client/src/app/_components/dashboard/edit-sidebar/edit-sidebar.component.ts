import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskManagerService } from '../../../_services/task-manager.service';
import { Direction } from '@angular/cdk/bidi/directionality';

@Component({
  selector: 'app-edit-sidebar',
  templateUrl: './edit-sidebar.component.html',
  styleUrls: ['./edit-sidebar.component.scss'],
})
export class EditSidebarComponent {
  rtl: Direction = 'rtl';
  @Input() taskToEdit: any;
  @Output() onTaskDelete = new EventEmitter<any>();

  constructor(private taskManagerService: TaskManagerService) {}

  deleteTask() {
    this.onTaskDelete.emit();
  }
}
