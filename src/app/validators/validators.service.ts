import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  emailPattern:string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  equalsFields(field1:string,field2:string) : ValidatorFn{

    return (formCotrol: AbstractControl) : ValidationErrors | null => {
      
      const control2 = formCotrol.get(field2);
      const field1Input : string = formCotrol.get(field1)?.value;
      const field2Input : string = formCotrol.get(field2)?.value;
      
      if(field1Input !== field2Input){
        control2?.setErrors({nonEquals:true})
        return {notEqualsFields:true}
      }
      if(control2?.errors && control2.hasError("nonEquals")){
        delete control2.errors["nonEquals"];
        control2.updateValueAndValidity();
      }

      return null;
    }
  }
}
