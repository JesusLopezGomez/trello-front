import { Component, Input, OnInit } from '@angular/core';
import { Board, Task } from '../interfaces/interfaces';
import { BoardService } from '../services/board.service';
import { Notyf } from 'notyf';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-project-boards',
  standalone: true,
  imports: [CommonModule,DragDropModule],
  templateUrl: './project-boards.component.html',
  styleUrl: './project-boards.component.css'
})
export class ProjectBoardsComponent implements OnInit{
  
  constructor(private boardService : BoardService,
      private taskService : TaskService,
      private router : Router
  ){}

  @Input() id : number = 0;

  boards : Board[] = [];

  notyf = new Notyf();

  movingTaskId: number | null = null;

  ngOnInit(): void {
    if(!isNaN(this.id)){
      this.boardService.getBoardsByProjects(this.id).subscribe({
        next:(boards) => {
          this.boards = boards;
          this.sortTasks();
        },
        error:(error) => {
          this.notyf.error(error.error.messages);
          this.router.navigateByUrl("/projects");
        }
      })
    }else{
      this.notyf.error(`No existe ningún proyecto con el id ${this.id}`);
      this.router.navigateByUrl("/projects");
    }
  }

  openedTasks: { [taskId: number]: boolean } = {};

  isTaskOpen(taskId: number): boolean {
      return this.openedTasks[taskId] || false;
  }

  toggleTask(taskId: number): void {
      this.openedTasks[taskId] = !this.openedTasks[taskId];
  }

  getConnectedBoardIds() {
    return this.boards.map((board, index) => `board-${index}`);
  }

  dropTask(event: CdkDragDrop<any[]>, boardIndex: number, boardId:number) {
      if (event.previousContainer === event.container) {
          // Si la tarea se reordena dentro del mismo tablero
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
          let tasksOrders = this.updateOrder(boardId,event.container.data);
          this.taskService.orderTasks(tasksOrders);
      } else {
          // Si la tarea se mueve a otro tablero
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          
          let titleTask = event.item.element.nativeElement.lastChild?.lastChild?.firstChild?.textContent;
          
          this.boards.map(board => {
            board.taskDTOs.map(task => {
              if(task.title == titleTask){
                task.idBoard = boardId;
                this.taskService.update(task).subscribe({
                  next:(task) => {
                    let tasksOrders = this.updateOrder(boardId,event.container.data);
                    this.taskService.orderTasks(tasksOrders);
                  },
                  error:(error) => {
                    this.notyf.error(error.error.messages);
                  }                
                })
              }
            })
          })
      }
  }

  updateOrder(boardId:number, tasks:Task[]):Task[] {
    let tasksOrders : Task[] = [];
    this.boards.map(board => {
      if(board.id == boardId){
        tasks.forEach((task, index) => {
          task.order = index + 1; 
        })
        board.taskDTOs = tasks;
        tasksOrders = board.taskDTOs;
      }
    })
    return tasksOrders;
  }

  sortTasks() {
    this.boards.forEach(board => {
      board.taskDTOs.sort((a, b) => a.order - b.order);
    });
  }

  onDragStart(taskId: number) {
    this.movingTaskId = taskId;
  }

  onDragEnd() {
      this.movingTaskId = null; 
  }
}
