import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { environment } from '@core/environments/environment.development';
import { attachmentResponse } from '@core/interfaces/Attachment.interface';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class FileService {

   @Output() eventClearFile: EventEmitter<void> = new EventEmitter()

   private http = inject(HttpClient);

   private serverUrlMedia: string = environment.server_url + "media";

   public upload(dataBody: FormData) {
      return this.http.post<attachmentResponse>(`${this.serverUrlMedia}/upload`, dataBody)
   }

   public getFile(fileName: string): Observable<Blob> {
      return this.http.get(`${this.serverUrlMedia}/${fileName}`, { responseType: 'blob'})
   }

   public uploadFile(archivoUploaded: File, description: string): Promise<attachmentResponse> {
      return new Promise((resolve, reject) => {
         const formData = new FormData();
         formData.append('file', archivoUploaded);
         formData.append('detail', description);
         this.upload(formData).subscribe({
            next: (resp) => {
               resolve(resp);
            },
            error: (err) => {
               reject(err)
            }
         });
      })
   }

   public getDataForUploadFile(file: File, description: string): FormData {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('detail', description);
      return formData;
   }

   public convertBase64ToFile(base64String: string, fileName: string, mimeType: MimeTypeEnum): File {
      if (base64String) {
         const byteCharacters = atob(base64String);
         const byteNumbers = new Array(byteCharacters.length);
         for (let i = 0; i < byteCharacters.length; i++) {
           byteNumbers[i] = byteCharacters.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         const blob = new Blob([byteArray], { type: mimeType });
         return new File([blob], fileName, { type: mimeType });
      }
      return null;
   }

   public convertFileToBase64(file: File, getCleanBase64: boolean): Promise<string> {
      return new Promise( (resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => {
            const base64Image = reader.result as string;
            getCleanBase64?
               resolve(base64Image.split(',')[1]):
               resolve(base64Image);
         };
         reader.onerror = error => reject(error);
      })
   }

   public downloadFile(file: File, fileName: string): void {
      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
   }

   public openFileInNewTab(file: File) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
   }
}
