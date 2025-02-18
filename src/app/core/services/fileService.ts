import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { attachmentResponse } from '@core/models/Attachment';

@Injectable({
   providedIn: 'root'
})
export class FileService {

   private http = inject(HttpClient);

   private serverUrl: string = environment.server_url;

   public upload(dataBody: any) {
      return this.http.post<attachmentResponse>(this.serverUrl + 'media/upload', dataBody)
   }

   public getFile(fileName: string) {
      return this.http.get<any>(this.serverUrl + 'media/' + fileName)
   }

   public subirArchivo(archivoUploaded: any, description: string, idTicket: number) {
      try {
         const formData = new FormData();
         formData.append('file', archivoUploaded);
         formData.append('detail', '');
         formData.append('id', idTicket.toString());
         this.upload(formData).subscribe({
            error: (err) => {
               console.log(err);
            }
         });
      } catch (error) {

      }
   }
}
