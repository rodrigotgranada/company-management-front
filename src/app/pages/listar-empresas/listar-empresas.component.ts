import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CadastrarEmpresaModalComponent } from '../../components/cadastrar-empresa-modal/cadastrar-empresa-modal.component';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  socios?: any[];
}

@Component({
  selector: 'app-listar-empresas',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterModule],
  templateUrl: './listar-empresas.component.html',
  styleUrls: ['./listar-empresas.component.scss'],
})
export class ListarEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
    this.checkAdminRole();
  }

  carregarEmpresas(): void {
    this.apiService.getEmpresas().subscribe(
      (empresas) => {
        this.empresas = empresas;

        this.empresas.forEach((empresa) => {
          this.apiService.getSociosPorEmpresa(empresa.id).subscribe(
            (socios) => {
              empresa.socios = socios;
            },
            (error) => {
              console.error(
                `Erro ao buscar sócios para a empresa ${empresa.nome}:`,
                error
              );
              empresa.socios = [];
            }
          );
        });
      },
      (error) => {
        console.error('Erro ao carregar empresas:', error);
      }
    );
  }

  checkAdminRole(): void {
    const user = this.authService.getUserInfo();
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      this.isAdmin = true;
    }
  }

  abrirModalCadastro(): void {
    if (this.dialog.openDialogs.length === 0) {
      const dialogRef = this.dialog.open(CadastrarEmpresaModalComponent, {
        width: '500px',
        maxWidth: '90vw',
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        disableClose: false,
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'saved') {
          this.carregarEmpresas();
        }
      });
    }
  }
}
