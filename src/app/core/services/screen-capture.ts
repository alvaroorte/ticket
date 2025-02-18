import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScreenCaptureService {

    async captureScreen(): Promise<any> {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const recorder = new MediaRecorder(stream);

            return new Promise((resolve) => {
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        const videoElement = document.createElement('video');
                        const url = URL.createObjectURL(event.data);
                        videoElement.src = url;


                        videoElement.addEventListener('loadedmetadata', async () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = videoElement.videoWidth;
                            canvas.height = videoElement.videoHeight;
                            const context = canvas.getContext('2d');
                            context!.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                            videoElement.addEventListener('seeked', () => {
                                context!.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                                const imageBase64 = canvas.toDataURL('image/png');
                                resolve(imageBase64)
                                URL.revokeObjectURL(url);
                            });
                            // Desencadenar el evento 'seeked' al establecer el tiempo
                            videoElement.currentTime = 100;
                        });
                    }
                };

                recorder.onstop = () => {
                    stream.getTracks().forEach((track) => track.stop());
                };

                recorder.start();

                setTimeout(() => {
                    recorder.stop();
                }, 500); // Captura durante medio segundo
                });
        } catch (error) {
            console.error('Error al capturar la pantalla:', error);
            throw error;
        }
    }
}
