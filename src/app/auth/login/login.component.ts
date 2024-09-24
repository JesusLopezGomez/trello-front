import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private fb: FormBuilder,
    private userService : UserService,
    private router : Router
  ){}

  myForm : FormGroup = this.fb.group({
    username:["",[Validators.required]],
    password:["",[Validators.required]],
  })

  notyf = new Notyf();

  showPassword : boolean = false;

  isValid(field:string){
    return this.myForm.get(field)?.errors && this.myForm.get(field)?.touched;
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  submit(){
    this.userService.login(this.myForm.value).subscribe({
      next: (resp) => {
        if(resp === true){
          this.userService.renew();
          this.router.navigateByUrl("/projects");
          this.notyf.success("¡Inicio de sesión con éxito!");
        }else{
          this.notyf.error("Creedenciales incorrectas...");
          this.myForm.reset();
        }
      },
      error: (error) => {
        this.notyf.error(error.error.messages); 
      }
    })
  }
}
