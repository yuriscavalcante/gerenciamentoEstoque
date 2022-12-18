/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.page.html',
  styleUrls: ['./product-register.page.scss'],
})
export class ProductRegisterPage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  public product: Product = {
    id: '',
    type: '',
    brand: '',
    price: 0,
    model: '',
    quantity: 0,
    description: '',
    url: '',
    availability: false
  };
  private loading: any;
  private uid: any;
  photo: any;
  isDesktop: boolean;
  type = 'gallery';
  imageSrc = 'https://touchcomp.com.br/wp-content/uploads/2020/04/controle-de-estoque.jpg';
  photos: Blob;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private prodService: ProductService,
    private router: Router,
    private afa: AngularFireAuth,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;
    }
  }

  async register()
  {
    await this.presentLoading();
    try
    {
      const res = await this.prodService.addProduct(this.uid, this.product);
      await this.sendImage(res.id, this.photos);

      this.router.navigate(['home']);
    }
    catch(error){

    }
    finally{
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  async getPicture() {
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && this.type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,

    });
    this.imageSrc = image.dataUrl;
    this.photos = await this.convertBase64ToBlob(this.imageSrc);
  }

  public async convertBase64ToBlob(imageBase64: string) {
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    return blob;
  }

  async sendImage(productId, image){
    const fd = new FormData();
    fd.append('imagem', image, productId);
    const res = await this.prodService.savePhotoProduct(this.uid, productId, image, this.product);
  }

}
