import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UpperCasePipe } from '@angular/common';
import { AddProjectComponent } from '../../add-project/add-project.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AddProjectComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  constructor(private userService : UserService,
              private router : Router
  ){}

  username = this.userService.username;

  role = this.userService.role;

  ngOnInit(): void {
    this.userService.renew();
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/");
  }
}
