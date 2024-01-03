import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public isLoading!: boolean;

  constructor(
    private toastCtrl: ToastController,
    public loadingController: LoadingController
  ) {

  }

  public applyTimezoneDateFix(date: Date): Date {
    if (!this.isObjectEmpty(date) && typeof date === 'object') {
      date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
    return date;
  }

  public isObjectEmpty(obj: any): boolean {
    if (obj === null || obj === undefined || obj === '') {
      return true;
    } else {
      return false;
    }
  }

  // successful message
  async successMsg(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      color: 'gunung-nago-report',
      duration: 2000,
      cssClass: 'toast-custom'
    });
    toast.present();
  }

  // unsuccessful message
  async unsuccessMsg(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      color: color,
      duration: 4000,
      cssClass: 'toast-custom'
    });
    toast.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait ...',
      cssClass: 'spinner-style',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  async presentLoadingDuration(duration: number) {
    const loading = await this.loadingController.create({
      cssClass: 'spinner-style',
      message: 'Please wait ...',
      duration
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  public downloadTemplate(fileResponse: any, filename: string): void {
    const downloadURL = window.URL.createObjectURL(fileResponse);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = filename;
    link.click();
  }

  public openTemplateInNewTab(fileResponse: any): void {
    const fileURL = URL.createObjectURL(fileResponse);
    window.open(fileURL, '_blank');
  }

  public toTitleCase(str: string | null): string | undefined {
    if (str) {
      return str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
    }
    return undefined;
  }

  public formatEggQuantity(value: number): number {
    return Math.floor(value);
  }
}
