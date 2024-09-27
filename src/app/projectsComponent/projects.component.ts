import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { projectService } from '../services/project.service';
import { Project } from '../interfaces/interfaces';
import { Notyf } from 'notyf';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class projectsComponent implements OnInit{
  constructor(private userService : UserService,
      private projectService : projectService,
      private route : ActivatedRoute,
      private router : Router
  ){}

  visible : boolean = false;

  notyf = new Notyf();

  projects : Project[] = [];

  projectEditOrDelete : Project = {id:0,boardDTOs:[],description:"",idUser:0,name:""};

  editing : boolean = false;

  @ViewChild('projectTitleInput') projectTitleInput!: ElementRef;

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next:(params) => {
        if(params['refresh']){
          this.searchProjects();
          this.router.navigateByUrl("/projects")
        }
      }
    })

    this.searchProjects();
  }

  edit(project:Project){
    this.projectEditOrDelete = project;
    this.editing = true;
    setTimeout(() => {
      if (this.projectTitleInput) {
        this.projectTitleInput.nativeElement.focus();
      }
    }, 0);
  }

  removeEdit(){
    this.projectEditOrDelete = {id:0,boardDTOs:[],description:"",idUser:0,name:""};
    this.editing = false;
  }

  confirmEdit(newTitle:string, newDescription:string){
    this.projectEditOrDelete.name = newTitle;
    this.projectEditOrDelete.description = newDescription;
    this.projectService.updateProject(this.projectEditOrDelete).subscribe({
      next:(project) => {
        this.notyf.success("¡Proyecto editado con éxito!");
        this.removeEdit();
        this.searchProjects();
      },
      error: (error) => {
        this.notyf.error(error.error.messages); 
      }
    })
  }

  searchProjects(){
    this.userService.searchUser(this.userService.username()).subscribe({
      next:(user) => {
        this.projectService.getProjectsByIdUser(user.id).subscribe({
          next:(projects) => {
            this.projects = projects;
          },
          error: (error) => {
            this.notyf.error(error.error.messages); 
          }
        })
      },
      error: (error) => {
        this.notyf.error(error.error.messages); 
      }
    })
  }

  handleKeydown(event: KeyboardEvent, projectTitleInput: HTMLTextAreaElement, projectDescriptionInput: HTMLTextAreaElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirmEdit(projectTitleInput.value, projectDescriptionInput.value);
    }
  }

  showDialog(){
    this.visible = true;
  }

  removeProject(project : Project){
    this.projectEditOrDelete = project;
  }

  confirmRemoveProject(){
    this.projectService.deleteProject(this.projectEditOrDelete).subscribe({
      next: (project) => {
        this.searchProjects()
        this.notyf.success("¡Proyecto eliminado con éxito!");
      },
      error: (error) => {
        this.notyf.error(error.error.messages); 
      }
    })
  }
}
