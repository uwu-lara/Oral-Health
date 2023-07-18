import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'swipe'
})
export class SwipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
