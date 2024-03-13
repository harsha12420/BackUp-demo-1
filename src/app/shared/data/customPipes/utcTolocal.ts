import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utcToDate',
})
export class UtcToDatePipe implements PipeTransform {
  transform(value: string): Date | null {
    if (!moment(value).isValid()) {
      return null;
    }

    return moment.utc(value).toDate();
  }
}
