import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { ILawProcess } from '../../services/mock-backend.interceptor';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { EllipsisPipe } from '../../utils/ellipsis.pipe';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { RouterLink } from '@angular/router';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { AlertComponent } from '../shared/alert/alert.component';
import { PageComponent } from '../shared/page/page.component';


@Component({
  selector: 'app-processes',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    EllipsisPipe,
    NgClass,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    RouterLink,
    DialogModule,
    PageComponent
  ],
  templateUrl: './processes.component.html',
  styleUrl: './processes.component.scss'
})
export class ProcessesComponent {

  processesList: ILawProcess[] = [];

  columns = [
    {
      columnDef: 'processNumber',
      header: 'Número do processo',
      cell: (row: ILawProcess) => `${row.processNumber}`
    },
    {
      columnDef: 'court',
      header: 'Tribunal',
      cell: (row: ILawProcess) => `${row.court}`
    },
    {
      columnDef: 'area',
      header: 'Área',
      cell: (row: ILawProcess) => `${row.area}`
    },
    {
      columnDef: 'description',
      header: 'Descrição',
      cell: (row: ILawProcess) => `${row.description}`
    },
  ]

  isSmallScreen : boolean = false;

  displayedColumns:string[] = this.columns.map(c => c.columnDef);

  constructor(private api: ApiService, private breakpointObserver: BreakpointObserver, public dialog: Dialog) {
    this.displayedColumns = this.displayedColumns.concat(['status','actions']);
  }

  ngOnInit(){
    this.getProcesses();
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isSmallScreen = result.matches;
    });

  }

  getProcesses(){
    this.api.get('/law-process').subscribe((data: any) => {
      this.processesList = data;
    });
  }

  deleteProcess(id: number){
    this.dialog.open(AlertComponent, {
      data: {
        title: 'Excluir processo',
        message: 'Tem certeza que deseja excluir esse processo?',
        type: 'warning',
        truthyButtonLabel: 'Sim',
        falsyButtonLabel: 'Não',
      },
      width: '350px',

    }).closed.subscribe((result) => {
      if(result){
        this.api.delete(`/law-process/${id}`).subscribe((res) => {
          console.log(res);
          this.dialog.open(AlertComponent, {
            data: {
              title: 'Processo excluído',
              message: 'Processo excluído com sucesso!',
              type: 'success',
            },
            width: '350px',
          });
          this.getProcesses();
        });
      }
    });

  }

}
