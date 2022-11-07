import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorDetails'
})
export class ErrorDetailsPipe implements PipeTransform {

  transform(error: any): string {
    if (!error || !error.error) { return null; }

    return error.error.message.replace(/\n/g, '<br />');
  }

}
