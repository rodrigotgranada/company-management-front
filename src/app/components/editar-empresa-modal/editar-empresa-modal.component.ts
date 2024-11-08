import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

@Component({
  selector: 'app-editar-empresa-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-empresa-modal.component.html',
  styleUrls: ['./editar-empresa-modal.component.scss'],
})
export class EditarEmpresaModalComponent {
  empresa: Empresa;
  attemptedSave: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditarEmpresaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { empresa: Empresa },
    private apiService: ApiService
  ) {
    this.empresa = { ...data.empresa };
  }

  onSave(): void {
    this.attemptedSave = true;

    if (
      !this.empresa.nome ||
      !this.empresa.cnpj ||
      !this.empresa.endereco ||
      !this.empresa.telefone ||
      !this.empresa.email
    ) {
      return;
    }

    this.apiService.atualizarEmpresa(this.empresa.id, this.empresa).subscribe(
      () => {
        this.dialogRef.close('updated');
      },
      (error) => {
        console.error('Erro ao atualizar empresa:', error);
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
        return !this.empresa.nome;
      case 'cnpj':
        return !this.empresa.cnpj;
      case 'endereco':
        return !this.empresa.endereco;
      case 'telefone':
        return !this.empresa.telefone;
      case 'email':
        return !this.empresa.email;
      default:
        return false;
    }
  }
}
