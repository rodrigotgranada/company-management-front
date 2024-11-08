import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarEmpresaModalComponent } from './cadastrar-empresa-modal.component';

describe('CadastrarEmpresaModalComponent', () => {
  let component: CadastrarEmpresaModalComponent;
  let fixture: ComponentFixture<CadastrarEmpresaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEmpresaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarEmpresaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
