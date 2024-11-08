import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaDetalhesComponent } from './empresa-detalhes.component';

describe('EmpresaDetalhesComponent', () => {
  let component: EmpresaDetalhesComponent;
  let fixture: ComponentFixture<EmpresaDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
