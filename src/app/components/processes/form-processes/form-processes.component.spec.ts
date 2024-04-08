import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProcessesComponent } from './form-processes.component';

describe('FormProcessesComponent', () => {
  let component: FormProcessesComponent;
  let fixture: ComponentFixture<FormProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProcessesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
