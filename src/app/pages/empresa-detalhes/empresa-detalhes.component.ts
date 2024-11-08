import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditarEmpresaModalComponent } from '../../components/editar-empresa-modal/editar-empresa-modal.component';
import { AdicionarSocioModalComponent } from '../../components/adicionar-socio-modal/adicionar-socio-modal.component';
import { EditarSocioModalComponent } from '../../components/editar-socio-modal/editar-socio-modal.component';
import { AuthService } from '../../services/auth.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  socios?: Socio[];
}

interface Socio {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
}

@Component({
  selector: 'app-empresa-detalhes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empresa-detalhes.component.html',
  styleUrls: ['./empresa-detalhes.component.scss'],
})
export class EmpresaDetalhesComponent implements OnInit {
  empresa: Empresa | undefined;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const empresaId = Number(params.get('id'));
      if (empresaId) {
        this.carregarDetalhesEmpresa(empresaId);
      }
    });
    this.checkAdminRole();
  }

  checkAdminRole(): void {
    const user = this.authService.getUserInfo();
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      this.isAdmin = true;
    }
  }

  carregarDetalhesEmpresa(empresaId: number): void {
    this.apiService.getEmpresaPorId(empresaId).subscribe(
      (empresa) => {
        this.empresa = empresa;

        this.apiService.getSociosPorEmpresa(empresaId).subscribe(
          (socios) => {
            this.empresa!.socios = socios;
          },
          (error) => {
            this.dialog.open(AlertModalComponent, {
              data: {
                type: 'error', // 'success' ou 'error' ou 'warning'
                message: 'Erro ao buscar sócios da empresa!',
              },
            });

            this.empresa!.socios = [];
          }
        );
      },
      (error) => {
        this.dialog.open(AlertModalComponent, {
          data: {
            type: 'error', // 'success' ou 'error' ou 'warning'
            message: 'Erro ao carregar detalhes da empresa!',
          },
        });
      }
    );
  }

  abrirModalEditarEmpresa(): void {
    if (this.empresa) {
      const dialogRef = this.dialog.open(EditarEmpresaModalComponent, {
        width: '700px',
        maxWidth: '90vw',
        data: { empresa: this.empresa },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'updated') {
          this.carregarDetalhesEmpresa(this.empresa!.id);
          this.dialog.open(AlertModalComponent, {
            data: {
              type: 'success', // 'success' ou 'error' ou 'warning'
              message: 'Sócio adicionado com sucesso!',
            },
          });
        } else {
          this.dialog.open(AlertModalComponent, {
            data: {
              type: 'error', // 'success' ou 'error' ou 'warning'
              message: 'Erro ao atualizar empresa!',
            },
          });
        }
      });
    }
  }

  abrirModalAdicionarSocio(): void {
    if (this.empresa) {
      const dialogRef = this.dialog.open(AdicionarSocioModalComponent, {
        width: '700px',
        maxWidth: '90vw',
        data: { empresaId: this.empresa.id },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'added') {
          this.carregarDetalhesEmpresa(this.empresa!.id);
          this.dialog.open(AlertModalComponent, {
            data: {
              type: 'success', // 'success' ou 'error' ou 'warning'
              message: 'Sócio adicionado com sucesso!',
            },
          });
        } else {
          this.dialog.open(AlertModalComponent, {
            data: {
              type: 'error', // 'success' ou 'error' ou 'warning'
              message: 'Erro ao adicionar sócio!',
            },
          });
        }
      });
    }
  }

  abrirModalEditarSocio(socio: Socio): void {
    const dialogRef = this.dialog.open(EditarSocioModalComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { socio },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.carregarDetalhesEmpresa(this.empresa!.id);
        this.dialog.open(AlertModalComponent, {
          data: {
            type: 'success', // 'success' ou 'error' ou 'warning'
            message: 'Sócio atualizado com sucesso!',
          },
        });
      } else {
        this.dialog.open(AlertModalComponent, {
          data: {
            type: 'error', // 'success' ou 'error' ou 'warning'
            message: 'Erro ao atualizar sócio!',
          },
        });
      }
    });
  }

  excluirSocio(socio: Socio): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Confirmação',
        message: `Deseja realmente excluir a empresa ${socio.nome}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.excluirSocio(socio.id).subscribe(
          () => {
            this.dialog.open(AlertModalComponent, {
              data: {
                type: 'success', // 'success' ou 'error' ou 'warning'
                message: 'Sócio excluído com sucesso!',
              },
            });
            this.carregarDetalhesEmpresa(this.empresa!.id);
          },
          (error) => {
            this.dialog.open(AlertModalComponent, {
              data: {
                type: 'error', // 'success' ou 'error' ou 'warning'
                message: 'Erro ao excluir sócio!',
              },
            });
          }
        );
      }
    });
  }

  excluirEmpresa(): void {
    if (!this.empresa) return;

    if (this.empresa.socios && this.empresa.socios.length > 0) {
      this.dialog.open(AlertModalComponent, {
        data: {
          type: 'error', // 'success' ou 'error' ou 'warning'
          message:
            'Não é possível excluir uma empresa que possui sócios cadastrados.',
        },
      });
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Confirmação',
        message: `Deseja realmente excluir a empresa ${this.empresa.nome}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.excluirEmpresa(this.empresa!.id).subscribe(
          () => {
            this.dialog.open(AlertModalComponent, {
              data: {
                type: 'success', // 'success' ou 'error' ou 'warning'
                message: 'Empresa excluída com sucesso!',
              },
            });
            this.router.navigate(['/listar-empresas']);
          },
          (error) => {
            this.dialog.open(AlertModalComponent, {
              data: {
                type: 'error', // 'success' ou 'error' ou 'warning'
                message: 'Empresa não excluída!',
              },
            });
          }
        );
      }
    });
  }
}
