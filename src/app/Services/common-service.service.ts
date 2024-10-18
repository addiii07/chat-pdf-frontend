import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private toastr: ToastrService) { }

  notification(notificationType: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) {
    this.toastr.clear();
    let titleMessage = title ? title : notificationType.charAt(0).toUpperCase() + notificationType.slice(1);

    (this.toastr as any)[notificationType](message, titleMessage, {
      positionClass: "toast-bottom-right",
      timeOut: 3000,
      maxOpened: 1,
      preventDuplicates: true,
      autoDismiss: true
    });
  }
}
