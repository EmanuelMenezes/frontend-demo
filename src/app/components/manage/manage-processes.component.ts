import { Component } from '@angular/core';
import { PageComponent } from '../shared/page/page.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { ILawProcess } from '../../services/mock-backend.interceptor';
import { EllipsisPipe } from '../../utils/ellipsis.pipe';
@Component({
  selector: 'app-manage-processes',
  standalone: true,
  imports: [
    PageComponent,
    CdkDrag,
    CdkDropList,
    EllipsisPipe
  ],
  templateUrl: './manage-processes.component.html',
  styleUrl: './manage-processes.component.scss'
})
export class ManageProcessesComponent {

  processesList: any = {
    'todo': [],
    'progress': [],
    'completed': []
  }

  constructor(private api: ApiService){

  }

  ngOnInit(): void {
    this.getProcesses()
  }

  getProcesses(){
    this.api.get('/law-process').subscribe((res: any) => {
      let groupedList = this.groupByStatus(res)
      this.processesList = {
        'todo': groupedList['todo'] || [],
        'progress': groupedList['progress'] || [],
        'completed': groupedList['completed'] || []
      }

    })
  }

  groupByStatus(list: ILawProcess[]){
    return list.reduce((acc: any, item: ILawProcess) => {
      if(!acc[item.status]){
        acc[item.status] = []
      }
      acc[item.status].push(item)
      return acc
    }, {})
  }

  drop(event: CdkDragDrop<ILawProcess[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.api.patch(`/law-process/${event.container.data[event.currentIndex].id}`, {status: event.container.id}).subscribe(() => {
        let index = this.processesList[event.container.id].findIndex((item: ILawProcess) => item.id === event.container.data[event.currentIndex].id)
        this.processesList[event.container.id][index].status = event.container.id
      })
    }
  }
}
