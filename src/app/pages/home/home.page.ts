/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from 'src/app/interfaces/store';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/internal/operators/map';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  private loading: any;
  public tam: any;
  public store = new Array<Store>();
  public uid;
  public item: Observable<Product[]>;
  public alert: any;
  items: Observable<Product[]>;
  range: any;
  filterType: any;
  handlerMessage = '';
  roleMessage = '';
  nfilter: any;
  checkedAlert: any [] = [false, false, false];
  constructor(
    private authService: AuthService,
    //private prodService: ProductService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private afa: AngularFireAuth,
    private alertController: AlertController,
  ) {
  }


  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    this.items = await this.productService.getProducts((await this.afa.currentUser).uid);
    this.item = await this.items;
    this.alert = await this.items.pipe(map(items => items.filter(item=>item.quantity<=5)));
    console.log(this.alert);

   }

   async ngOnDestroy(){
    this.uid = '';
   }

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  cancel() {
    this.modal.dismiss(null, 'Fechar');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
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

  registerPath(){
    this.router.navigate(['product-register']);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '',
      cssClass: '',
      buttons: [ {
        text: 'Adicionar produto',
        icon: 'duplicate-outline',
        handler: () => {
          this.router.navigate(['/product-register']);
        }
      }, {
        text: 'Perfil',
        icon: 'person-outline',
        data: 'Data value',
        handler: () => {
          //console.log('Play clicked');
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
    //console.log('onDidDismiss resolved with role and data', role, data);
  }

  createStore(){
    this.router.navigate(['store-register']);
  }

  details()
  {
    this.router.navigate(['details']);
  }

  search(value: string){
    //console.log(value);
    const filter = this.items.pipe(map(items => items.filter((res: any)=>{
      if(this.filterType === 'model'){
        return !res.model.toUpperCase().indexOf(value.toUpperCase());
      }else if(this.filterType === 'brand'){
        return !res.brand.toUpperCase().indexOf(value.toUpperCase());
      }else if(this.filterType === 'type'){
        return !res.type.toUpperCase().indexOf(value.toUpperCase());
      }else{
        return !res.model.indexOf(value.toUpperCase());
      }
    })));
    this.item = filter;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Filtro de pesquisa',
      inputs: [
        {
          name:'brand',
          label: 'Marca',
          type: 'radio',
          handler: (alertData)=>{
            this.filterType = alertData.name;
            alert.dismiss();
            console.log(this.filterType);
            if(this.filterType === 'brand'){
              this.checkedAlert = [true, false, false];
            }
          },
          checked: this.checkedAlert[0]
        },
        {
          name:'model',
          label: 'Modelo',
          type: 'radio',
          handler: (alertData)=>{
            this.filterType = alertData.name;
            alert.dismiss();
            console.log(this.filterType);
            if(this.filterType === 'model'){
              this.checkedAlert = [false, true, false];
            }
          },
          checked: this.checkedAlert[1]
        },
        {
          name:'type',
          label: 'Tipo de produto',
          type: 'radio',
          handler: (alertData)=>{
            this.filterType = alertData.name;
            alert.dismiss();
            console.log(this.filterType);
            if(this.filterType === 'type'){
              this.checkedAlert = [false, false, true];
            }
          },
          checked: this.checkedAlert[2]
        },
      ],
    });

    await alert.present();
  }

}
