import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stripMiddleName',
    standalone: false
})
export class StripMiddleNamePipe implements PipeTransform {

  transform(fullName: string): string {
    const split = fullName.trim().split(' ');

    return split.length < 2 ?
      fullName.trim() :
      split[0] + ' ' + split[split.length - 1];
  }

}
