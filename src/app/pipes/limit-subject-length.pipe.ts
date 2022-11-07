import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitSubjectLength'
})
export class LimitSubjectLengthPipe implements PipeTransform {

  transform(subject: string): string {
    return subject.substring(0, 20);
  }
}