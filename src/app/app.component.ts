import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./layout/nav-bar/nav-bar.component";
import { CdkDrag, CdkDragDrop, CdkDragHandle, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FooterComponent } from './layout/footer/footer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, FooterComponent, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'adminTaskFront';

  boards = [
    {
      title: 'To Do',
      tasks: [
        'Tarea 1' ,
        'Tarea 2' 
      ]
    },
    {
      title: 'In Progress',
      tasks: [
        'Tarea 3',
        'Tarea 4'
      ]
    },
    {
      title: 'Done',
      tasks: [
        'Tarea 5',
        'Tarea 6' 
      ]
    }
  ]

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getConnectedLists(index: number): string[] {
    return this.boards.map((board, i) => i !== index ? `cdk-drop-list-${i}` : '').filter(id => id);
  }
}
