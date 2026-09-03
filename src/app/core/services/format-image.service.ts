import { inject, Renderer2 } from '@angular/core';
import { Image } from 'primeng/image';

export class FormatImagesService {

  private renderer2 = inject(Renderer2);

  public widthImgaesInsideContainer(
    images: HTMLImageElement[],
    width: '25%' | '50%' | '75%' | '100%',
    imageViewChild: Image
  ) {
    images.forEach(( img: HTMLImageElement ) => {
      this.renderer2.setStyle(img, 'width', width);
      this.renderer2.addClass(img, 'cursor-pointer');
      this.renderer2.addClass(img, 'full-screen');
      if (imageViewChild) {
        img.addEventListener('click', () => this.onImageClick(imageViewChild, img.src));
      }
    });
  }

  private onImageClick(imageViewChild: Image, imageSrc: string) {
    imageViewChild.src = imageSrc;
    imageViewChild.previewImageSrc = imageSrc;
    imageViewChild.onImageClick();
  }
}
