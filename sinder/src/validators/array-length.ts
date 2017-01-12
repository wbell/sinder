import { FormControl } from '@angular/forms';

export function ArrayMinLength(len: number) {
  // console.log('len', len);
  return (c: FormControl) =>{
    // console.log('c', c);
    return (c.value.length >= len) ? null : {
      ArrayMinLength: true
    };
  };
}

export function ArrayMaxLength(len: number) {
  // console.log('len', len);
  return (c: FormControl) =>{
    // console.log('c', c);
    return (c.value.length <= len) ? null : {
      ArrayMaxLength: true
    };
  };
}
