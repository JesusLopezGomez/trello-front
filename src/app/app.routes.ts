import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { projectsComponent } from './projectsComponent/projects.component';
import { notLogged } from './guardians/notLogged.guard';
import { ProjectBoardsComponent } from './project-boards/project-boards.component';
import { HomeComponent } from './home/home.component';
import { loggedGuard } from './guardians/logged.guard';

export const routes: Routes = [
    {path:"register", component:RegisterComponent, canMatch:[loggedGuard]},
    {path:"login", component:LoginComponent, canMatch:[loggedGuard]},
    {path:"projects", component:projectsComponent, canMatch:[notLogged]},
    {path:"project/:id", component:ProjectBoardsComponent, canMatch:[notLogged]},
    {path:"", component:HomeComponent, canMatch:[loggedGuard]}
];
