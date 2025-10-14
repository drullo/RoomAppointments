import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@cleavelandprice/ngx-lib/active-directory';

@Pipe({
    name: 'employeeByEmail',
    standalone: false
})
export class EmployeeByEmailPipe implements PipeTransform {
  transform(emailAddress: string, users: User[]): User {
    return users.find(user => user.mail?.toLowerCase() === emailAddress.toLowerCase());
  }
}