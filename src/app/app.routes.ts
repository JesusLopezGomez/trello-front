import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { projectsComponent } from './projectsComponent/projects.component';
import { loggedGuard } from './guardians/logged.guard';

export const routes: Routes = [
    {path:"register", component:RegisterComponent},
    {path:"login", component:LoginComponent},
    {path:"projects", component:projectsComponent, canMatch:[loggedGuard]},
];
