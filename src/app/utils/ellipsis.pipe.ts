import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, limit: number): unknown {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }

}
