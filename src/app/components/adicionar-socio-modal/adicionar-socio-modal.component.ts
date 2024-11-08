import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Socio {
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
}

@Component({
  selector: 'app-adicionar-socio-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adicionar-socio-modal.component.html',
  styleUrls: ['./adicionar-socio-modal.component.scss'],
})
export class AdicionarSocioModalComponent {
  socio: Socio = { nome: '', cpf: '', endereco: '', telefone: '' };
  empresaId: number;
  attemptedSave: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AdicionarSocioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresaId: number },
    private apiService: ApiService
  ) {
    this.empresaId = data.empresaId;
  }

  onSave(): void {
    this.attemptedSave = true;

    if (
      !this.socio.nome ||
      !this.socio.cpf ||
      !this.socio.endereco ||
      !this.socio.telefone
    ) {
      return;
    }

    const novoSocio = { ...this.socio, empresaId: this.empresaId };
    this.apiService.cadastrarSocio(novoSocio).subscribe(
      () => {
        this.dialogRef.close('added');
      },
      (error) => {
        console.error('Erro ao cadastrar sócio:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.attemptedSave) return false;

    switch (fieldName) {
      case 'nome':
        return !this.socio.nome;
      case 'cpf':
        return !this.socio.cpf;
      case 'endereco':
        return !this.socio.endereco;
      case 'telefone':
        return !this.socio.telefone;
      default:
        return false;
    }
  }
}
