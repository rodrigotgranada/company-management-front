import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userRole: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe((loggedIn: boolean) => {
      this.isUserLoggedIn = loggedIn;
      if (loggedIn) {
        const user = this.authService.getUserInfo();
        this.userRole = user?.roles.includes('ROLE_ADMIN')
          ? 'ROLE_ADMIN'
          : 'ROLE_USER';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
