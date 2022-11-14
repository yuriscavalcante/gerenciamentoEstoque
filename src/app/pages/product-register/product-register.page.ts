/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-product-register',
  templateUrl: './product-register.page.html',
  styleUrls: ['./product-register.page.scss'],
})
export class ProductRegisterPage implements OnInit {
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
  teste: any;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private prodService: ProductService,
    private router: Router,
    private afa: AngularFireAuth,
  ) {}

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
  }

  async register()
  {
    await this.presentLoading();
    try
    {
      await this.prodService.addProduct(this.uid, this.product);
      await this.prodService.addBrand(this.uid, this.product.brand.toString());
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

}
