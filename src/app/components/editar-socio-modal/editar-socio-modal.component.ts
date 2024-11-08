import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Socio {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
}

@Component({
  selector: 'app-editar-socio-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-socio-modal.component.html',
  styleUrls: ['./editar-socio-modal.component.scss'],
})
export class EditarSocioModalComponent {
  socio: Socio;
  attemptedSave: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditarSocioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { socio: Socio },
    private apiService: ApiService
  ) {
    this.socio = { ...data.socio };
  }

  onSave(): void {
    this.attemptedSave = true;

    if (!this.isFormValid()) {
      return;
    }

    this.apiService.atualizarSocio(this.socio.id, this.socio).subscribe(
      () => {
        this.dialogRef.close('updated');
      },
      (error) => {
        console.error('Erro ao atualizar sócio:', error);
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

  isFormValid(): boolean {
    return (
      !!this.socio.nome &&
      !!this.socio.cpf &&
      !!this.socio.endereco &&
      !!this.socio.telefone
    );
  }
}
