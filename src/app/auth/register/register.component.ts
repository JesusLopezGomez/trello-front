import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { ValidatorsService } from '../../validators/validators.service';
import { CommonModule } from '@angular/common';
import { ValidateEmailService } from '../../validators/validate-email.service';
import { ValidateUsernameService } from '../../validators/validate-username.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder,
    private userService : UserService,
    private validatorsService : ValidatorsService,
    private validateEmail : ValidateEmailService,
    private validateUsername : ValidateUsernameService,
    private router : Router
  ){}

  myForm : FormGroup = this.fb.group({
    username:["",[Validators.required],[this.validateUsername]],
    email:["",[Validators.required, Validators.pattern(this.validatorsService.emailPattern)],[this.validateEmail]],
    password:["",[Validators.required]],
    confirmPassword:[""]
  },{validators:[this.validatorsService.equalsFields("password","confirmPassword")]})

  notyf = new Notyf();

  showPassword : boolean = false;

  showPasswordConfirm : boolean = false;

  submit(){
    let {confirmPassword, ...user} = this.myForm.value;
    this.userService.save(user).subscribe({
      next: (userResponse) => {
        this.notyf.success("¡Usuario registrado con éxito!")
        let {email, ...usernameAndPassword} = user;
        this.userService.login(usernameAndPassword).subscribe({
          next: (resp) => {
            this.userService.renew();
            this.router.navigateByUrl("/");
          },
          error: (error) => {
            this.notyf.error(error.error.messages); 
          }
        })
      },
      error: (error) => {this.notyf.error(error.error.messages);}
    })
    
  }

  isValid(field:string){
    return this.myForm.get(field)?.errors && this.myForm.get(field)?.touched;
  }

  get emailErrorsMsg():string{
    const errors = this.myForm.get("email")?.errors;
    let errorMsg = "";
    if(this.myForm.get("email")?.touched && errors){
      if(errors['required']){
        errorMsg = "El email es obligatorio";
      }else if(errors['pattern']){
        errorMsg = "El email no tiene formato correcto";
      }else if(errors['emailTaken']){
        errorMsg = "El email ya existe en base de datos";
      }
    }

    return errorMsg;
  }

  get usernameErrosMsg():string{
    const errors = this.myForm.get("username")?.errors;
    let errorMsg = "";
    if(this.myForm.get("username")?.touched && errors){
      if(errors['required']){
        errorMsg = "El nombre de usuario es obligatorio";
      }else if(errors['usernameTaken']){
        errorMsg = "El nombre de usuario ya existe en base de datos";
      }
    }

    return errorMsg;
  }


  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility(){
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}
