import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { projectService } from '../services/project.service';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {

  constructor(private fb: FormBuilder,
    private projectService : projectService,
    private router : Router
  ){}

  notyf = new Notyf();

  myForm : FormGroup = this.fb.group({
    name:["",[Validators.required]],
    description:["",[Validators.required]],
  })

  
  isValid(field:string){
    return this.myForm.get(field)?.errors && this.myForm.get(field)?.touched;
  }

  submit(){
    this.projectService.saveProject(this.myForm.value).subscribe({
      next: (project) => {
        this.notyf.success("¡Proyecto creado con éxito!");
        this.router.navigateByUrl("/projects?refresh=true");
        this.myForm.reset();
        document.getElementById("cancelButton")?.click();
      },
      error: (error) => this.notyf.error(error.error.messages) 
    })
  }
}
