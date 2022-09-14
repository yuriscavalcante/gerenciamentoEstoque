import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { observable, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from 'src/app/interfaces/store';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from 'src/app/interfaces/user';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private loading: any;
  public tam: any;
  public store = new Array<Store>();
  private storeSubscription: Subscription;
  public uid;
  private itemDoc: AngularFirestoreDocument<User>;
  public item: Observable<Product[]>;
  items: Observable<Product[]>;
  isModalOpen = false;

  constructor(
    private authService: AuthService,
    //private prodService: ProductService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private afa: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    
  }

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    console.log(this.uid);
    
    //console.log(this.item);
    
    //this.item = this.authService.getInfo(this.uid);
    this.item = this.productService.getProducts(this.uid);
    this.items = this.item.pipe(map(item => item.filter(items=>items.quantity<=5)));
    
    
    

   }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '',
      cssClass: '',
      buttons: [{
        text: 'Adicionar Loja',
        icon: 'add-outline',
        id: 'add-button',
        data: {
          type: 'createStore'
        },
        handler: () => {
          this.createStore();
        }
      }, {
        text: 'Adicionar produto',
        icon: 'duplicate-outline',
        handler: () => {
          this.router.navigate(['product-register']);
        }
      }, {
        text: 'Perfil',
        icon: 'person-outline',
        data: 'Data value',
        handler: () => {
          console.log('Play clicked');
        }
      },
     {
        text: 'Desconectar',
        icon: 'log-out',
        handler: () => {
          this.authService.logout();
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  createStore(){
    this.router.navigate(['store-register']);
  }

  details()
  {
    this.router.navigate(['details']);
  }

  
}