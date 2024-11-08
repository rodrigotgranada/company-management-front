import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

interface Socio {
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
}

@Component({
  selector: 'app-cadastrar-empresa-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar-empresa-modal.component.html',
  styleUrls: ['./cadastrar-empresa-modal.component.scss'],
})
export class CadastrarEmpresaModalComponent {
  nome: string = '';
  cnpj: string = '';
  endereco: string = '';
  telefone: string = '';
  email: string = '';
  socios: Socio[] = [];
  errorMessages: string[] = [];
  attemptedSave: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CadastrarEmpresaModalComponent>,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  onSave(): void {
    this.errorMessages = [];
    this.attemptedSave = true;
    if (!this.nome) this.errorMessages.push('Nome da empresa é obrigatório.');
    if (!this.cnpj) this.errorMessages.push('CNPJ da empresa é obrigatório.');
    if (!this.endereco)
      this.errorMessages.push('Endereço da empresa é obrigatório.');
    if (!this.telefone)
      this.errorMessages.push('Telefone da empresa é obrigatório.');
    if (!this.email) this.errorMessages.push('Email da empresa é obrigatório.');
    const sociosValidos = this.socios.filter(
      (socio) => socio.nome && socio.cpf && socio.endereco && socio.telefone
    );
    if (this.socios.length > 0 && sociosValidos.length !== this.socios.length) {
      this.errorMessages.push('Todos os campos dos sócios são obrigatórios.');
    }
    if (this.errorMessages.length > 0) {
      return;
    }

    const novaEmpresa = {
      nome: this.nome,
      cnpj: this.cnpj,
      endereco: this.endereco,
      telefone: this.telefone,
      email: this.email,
    };

    this.apiService.cadastrarEmpresa(novaEmpresa).subscribe(
      (empresa) => {
        if (!empresa || !empresa.id) {
          this.errorMessages.push(
            'Erro: A resposta da API não contém o ID da empresa recém-criada.'
          );
          return;
        }

        const empresaId = empresa.id;

        if (sociosValidos.length > 0) {
          sociosValidos.forEach((socio) => {
            const novoSocio = {
              nome: socio.nome,
              cpf: socio.cpf,
              endereco: socio.endereco,
              telefone: socio.telefone,
              empresaId: empresaId,
            };

            this.apiService.cadastrarSocio(novoSocio).subscribe(
              () => {
                this.dialog.open(AlertModalComponent, {
                  data: {
                    type: 'success', // 'success' ou 'error' ou 'warning'
                    message: `Sócio ${socio.nome} cadastrado com sucesso.`,
                  },
                });
              },
              (error) => {
                this.dialog.open(AlertModalComponent, {
                  data: {
                    type: 'error', // 'success' ou 'error' ou 'warning'
                    message: `Erro ao cadastrar sócio ${socio.nome}`,
                  },
                });
                console.error(`Erro ao cadastrar sócio ${socio.nome}:`, error);
                this.errorMessages.push(
                  `Erro ao cadastrar sócio ${socio.nome}: ${
                    error.error?.message || 'Erro desconhecido.'
                  }`
                );
              }
            );
          });
        }

        if (this.errorMessages.length === 0) {
          this.dialog.open(AlertModalComponent, {
            data: {
              type: 'success', // 'success' ou 'error' ou 'warning'
              message: `Empresa ${this.nome} cadastrada com sucesso!`,
            },
          });
          this.dialogRef.close('saved');
        }
      },
      (error) => {
        this.dialog.open(AlertModalComponent, {
          data: {
            type: 'error', // 'success' ou 'error' ou 'warning'
            message: `Erro ao cadastrar empresa`,
          },
        });
        console.error('Erro ao cadastrar empresa:', error);
        this.errorMessages.push(
          error.error?.message || 'Erro desconhecido ao cadastrar a empresa.'
        );
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addSocio(): void {
    this.socios.push({ nome: '', cpf: '', endereco: '', telefone: '' });
  }

  removeSocio(index: number): void {
    this.socios.splice(index, 1);
  }

  isFieldInvalid(fieldName: string, index?: number): boolean {
    if (!this.attemptedSave) return false;

    if (index !== undefined) {
      const socio = this.socios[index];
      switch (fieldName) {
        case 'nome':
          return !socio.nome;
        case 'cpf':
          return !socio.cpf;
        case 'endereco':
          return !socio.endereco;
        case 'telefone':
          return !socio.telefone;
        default:
          return false;
      }
    } else {
      switch (fieldName) {
        case 'nome':
          return !this.nome;
        case 'cnpj':
          return !this.cnpj;
        case 'endereco':
          return !this.endereco;
        case 'telefone':
          return !this.telefone;
        case 'email':
          return !this.email;
        default:
          return false;
      }
    }
  }
}
