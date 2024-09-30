import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Board, Project, Task } from '../interfaces/interfaces';
import { BoardService } from '../services/board.service';
import { Notyf } from 'notyf';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { projectService } from '../services/project.service';

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
      private userService : UserService,
      private projectService : projectService,
      private router : Router,
  ){}

  @Input() id : number = 0;

  project : Project | null = null;

  boards : Board[] = [];

  notyf = new Notyf();

  movingTaskId: number | null = null;

  openedTasks: { [taskId: number]: boolean } = {};

  currentBoardId : number = 0; 

  idTaskEditing : number = 0;

  isClickNewBoard : boolean = false;

  boardEditing : number = 0;

  deleteBoardModal : Board = {id: 0, idProject: 0, name: "", taskDTOs:[]};

  @ViewChild('titleTaskEdit') titleTaskInputEdit!: ElementRef;

  @ViewChild('nameBoard') nameNewBoard!: ElementRef;

  @ViewChild('newNameBoardEdit') nameEditBoard!: ElementRef;

  ngOnInit(): void {
    if(!isNaN(this.id)){
      this.projectService.getById(this.id).subscribe({
        next:(project) => {
          this.project = project;
        },
        error:(error) => {
          this.notyf.error(error.error.messages);
        }
      })

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

  openNewTask(boardId:number) {
    this.currentBoardId = boardId;
  }

  closeNewTask(title:HTMLInputElement, description:HTMLTextAreaElement) {
    title.value = "";
    description.value = "";
    this.currentBoardId = 0;
  }

  saveNewTask(title:HTMLInputElement, description:HTMLTextAreaElement, idBoard: number){
    this.userService.searchUser(this.userService.username()).subscribe({
      next:(user) => {
        this.taskService.save({title:title.value,description:description.value,idBoard,idUser:user.id}).subscribe({
          next:(task) => {
            this.notyf.success("¡Tarea añadida con éxito!");
            this.closeNewTask(title,description);
            this.ngOnInit();
          },
          error:(error) => {
            this.notyf.error(error.error.messages);
          }    
        })
      },
      error:(error) => {
        this.notyf.error(error.error.messages);
      }    
    })
  }

  deleteTask(idTask:number){
    this.taskService.delete(idTask).subscribe({
      next:(task) => {
        this.notyf.success("¡Tarea eliminada con éxito!");
        this.ngOnInit();
      },
      error:(error) => {
        this.notyf.error(error.error.messages);
      }    
    })
  }

  setIdTaskEditing(idTask : number){
    this.idTaskEditing = idTask;
    setTimeout(() => {
      if (this.titleTaskInputEdit) {
        this.titleTaskInputEdit.nativeElement.focus();
      }
    }, 0);
  }

  closeEdit(task:Task){
    this.openedTasks[task.id] = false;
    this.idTaskEditing = 0;
  }

  updateTask(newTitle : string, newDescription : string, taskUpdate : Task){
    taskUpdate.title = newTitle;
    taskUpdate.description = newDescription;
    this.taskService.update(taskUpdate).subscribe({
      next:(task) => {
        this.notyf.success("¡Tarea editada con éxito!");
        this.ngOnInit();
        this.closeEdit(task);
        
      },
      error:(error) => {
        this.notyf.error(error.error.messages);
      }  
    })
  }

  newBoard(){
    this.isClickNewBoard = true;
    setTimeout(() => {
      if (this.nameNewBoard) {
        this.nameNewBoard.nativeElement.focus();
      }
    }, 0);
  }

  cancelNewBoard(){
    this.isClickNewBoard = false;
  }

  saveNewBoard(nameBoard:string){ 
    this.boardService.save({name:nameBoard, idProject: this.id}).subscribe({
      next:(board) => {
        this.notyf.success("¡Tablero añadido con éxito!");
        this.cancelNewBoard();
        this.ngOnInit();
      },
      error:(error) => {
        this.notyf.error(error.error.messages);
      }  
    })
  }

  setDeleteBoard(board:Board){
    this.deleteBoardModal = board;
  }

  deleteBoard(boardId:number){
    this.boardService.delete(boardId).subscribe({
      next:(board) => {
        this.notyf.success("¡Tablero eliminado con éxito!");
        this.ngOnInit();
      },
      error:(error) => {
        this.notyf.error(error.error.messages);
      }  
    })
  }

  handleKeydown(event: KeyboardEvent, nameBoard:string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveNewBoard(nameBoard);
    }
  }

  selectEditBoard(boardId:number){
    this.boardEditing = boardId;
    setTimeout(() => {
      if (this.nameEditBoard) {
        this.nameEditBoard.nativeElement.focus();
      }
    }, 0);
  }

  cancelEditBoard(){
    this.boardEditing = 0;
  }

  editBoard(board:Board){
    if(this.nameEditBoard){
      board.name = this.nameEditBoard.nativeElement.value;
      this.boardService.update(board).subscribe({
        next:(board) => {
          this.notyf.success("¡Tablero editado con éxito!");
          this.cancelEditBoard();
          this.ngOnInit();
        },
        error:(error) => {
          this.notyf.error(error.error.messages);
        } 
      })
    }
  }
}
