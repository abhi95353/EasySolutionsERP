import { AbstractControl } from '@angular/forms';

export function FeeCollectValidator(control: AbstractControl) {
  console.log(control)
  // if (!control.value.startsWith('https') || !control.value.includes('.io')) {
    return { invalidUrl: false };
  // }
  return null;
} 