import { Component } from '@angular/core';
import { PageComponent } from '../../shared/page/page.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-form-processes',
  standalone: true,
  imports: [
    PageComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './form-processes.component.html',
  styleUrl: './form-processes.component.scss'
})
export class FormProcessesComponent {

  subtitle = 'Cadastrando Processo';
  action = 'add';

  formProcesso: FormGroup;

  areaList = [
    'Direito Civil',
    'Direito Penal',
    'Direito Trabalhista',
    'Direito Tributário',
    'Direito Administrativo',
  ]

  courtList = [
    'Tribunal de Justiça de São Paulo',
    'Tribunal de Justiça de Minas Gerais',
    'Tribunal de Justiça do Rio de Janeiro',
    'Tribunal de Justiça do Rio Grande do Sul',
    'Tribunal de Justiça de Santa Catarina',
  ]

  statusList = [
    {
      value: 'todo',
      label: 'A fazer'
    },
    {
      value: 'progress',
      label: 'Em andamento'
    },
    {
      value: 'completed',
      label: 'Concluído'
    }
  ]

  constructor(private route: ActivatedRoute, private api: ApiService, private fb: FormBuilder, private dialog: Dialog, private router: Router) {
    this.formProcesso = this.fb.group({
      id: [null],
      processNumber: [null, Validators.required],
      court: [null, Validators.required],
      area: [null, Validators.required],
      description: [''],
      status: ['todo'],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe(params => {
      if (!(params['id'] && params['id'] !== 'new')) {
        return;
      }
      this.subtitle = 'Editando Processo';
      this.action = 'edit';
      this.getProcessById(params['id']);
    });
  }

  getProcessById(id: string) {
    this.api.get('/law-process', { id }).subscribe((res: any) => {
      this.subtitle += ` N° ${res.processNumber}`;
      this.formProcesso.patchValue(res);
    });
  }

  saveProcess() {
    if (this.formProcesso.valid) {
      if (this.action === 'add') {
        this.api.post('/law-process', this.formProcesso.value).subscribe((res: any) => {
          this.router.navigate(['/home/processes']);
          this.dialog.open(AlertComponent, {
            data: {
              message: 'Processo cadastrado com sucesso!',
              type: 'success',
            },
            width: '350px',
          });
        });
      } else {
        this.api.put('/law-process', this.formProcesso.value).subscribe((res: any) => {
          this.router.navigate(['/home/processes']);
          this.dialog.open(AlertComponent, {
            data: {
              message: 'Processo atualizado com sucesso!',
              type: 'success',
            },
            width: '350px',
          });
        });
      }
    }
  }

}
