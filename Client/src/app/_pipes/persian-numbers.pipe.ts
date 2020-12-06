import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianNumbers'
})
export class PersianNumbersPipe implements PipeTransform {
  persianNumbers: Array<string> = [ '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ];

  transform(value: number, args?: any): any {
    let persianNumString: string = '';
    let str = value.toString();
    for(let i=0; i < str.length; i++){
      persianNumString += this.persianNumbers[str[i]];
    }

    return persianNumString;
  }

}
