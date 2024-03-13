import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private toastr: ToastrService) { }
  public forgetEmail = new BehaviorSubject(null);
  private userData: BehaviorSubject<any> = new BehaviorSubject(null);

  setUserData(data: any) {
    this.userData.next(data);
  }
  getUserData() {
    return this.userData.asObservable();
  }

  showLoading() {
    document.querySelector('#custom-loader')?.classList.add('visible');
  }

  hideLoading() {
    document.querySelector('#custom-loader')?.classList.remove('visible');
  }
  showSuccessToast(msg) {
    this.toastr.success(msg);
  }

  showErrorToast(msg) {
    this.toastr.error(msg);
  }

  showInfoToast(msg) {
    this.toastr.info(msg);
  }
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).map((key) => {
      formGroup.controls[key].markAsTouched();
      formGroup.controls[key].markAsDirty();
      const mayBeFG = formGroup.controls[key] as FormGroup;
      if (mayBeFG.controls) {
        this.markFormGroupTouched(mayBeFG);
      }
    });
  }

  async compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = async () => {
          const canvas: any = document.createElement('canvas');
          let height = 55;
          let width = 199;

          img.height = height;
          img.width = width;
          canvas.width = width;
          canvas.height = height;
          await canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          await canvas.toDataURL();
          // return resolve(this.dataURItoBlob(img.src));
          const newFile = await this.convertToBlob(canvas, file);
          return resolve(newFile);
        };
      };
    });
  }

  async convertToBlob(file, f) {
    return new Promise((resolve, reject) => {
      /* Old Code Without Quality*/
      file.toBlob(async (blob: any) => {
        const bufferMedia = new Uint8Array(await blob.arrayBuffer());
        const filename = f.name.split('.').slice(0, -1).join('.');
        const imageFile = await new File([bufferMedia], filename, {
          type: f.type,
        });
        return resolve(imageFile);
      });
      // });

      /* New Code With Quality*/
      // file.toBlob(async (blob: any) => {
      //   const bufferMedia = new Uint8Array(await blob.arrayBuffer());
      //   const filename = f.name.split('.').slice(0, -1).join('.')
      //   const imageFile = await new File([bufferMedia], filename, { type: f.type  });

      //   return resolve(imageFile);
      // }, f.type, 0.75);
    });
  }

  toCamelCase(inputString) {
    console.log(inputString);

    const words = inputString
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length === 0) {
      return '';
    }
    const firstWord = words[0].toLowerCase();
    const camelCasedWords = words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return firstWord + camelCasedWords.join('');
  }

  convertSpacedString(inputString: String) {
    return inputString.trim().toLowerCase().replace(' ', '_');
  }

  public setSashboardImgSet = new BehaviorSubject(null);
}
