import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'ROLE_USER';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      return;
    }

    const registerData = {
      email: this.email,
      password: this.password,
      role: this.role,
    };

    this.apiService.registerUser(registerData).subscribe(
      () => {
        this.dialog.open(AlertModalComponent, {
          data: {
            type: 'success', // 'success' ou 'error' ou 'warning'
            message: `Usuário registrado com sucesso!`,
          },
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage =
          error.error?.message || 'Erro ao registrar usuário.';
      }
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    switch (fieldName) {
      case 'email':
        return !this.email;
      case 'password':
        return !this.password;
      case 'role':
        return !this.role;
      default:
        return false;
    }
  }
}
