/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute} from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public product: Product;
  private loading: any;
  public uid;
  teste: any;
  private productId: string = null;
  items: Observable<Product[]>;
  item: Observable<Product[]>;
  products: Observable<Product[]>;
  isModalOpen = false;
  public availability = 'false';

  @ViewChild(IonModal) modal: IonModal;
  constructor(
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private afa: AngularFireAuth,
    private activeteRoute: ActivatedRoute
  ) {
    this.productId = this.activeteRoute.snapshot.params['id'];
    console.log(this.productId);
  }

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    console.log(this.uid);

    //this.items.subscribe(val =>console.log(val), error=>console.log("Error"), ()=>console.log("Complete"))
    this.item = this.productService.getProducts(this.uid);
    this.items = this.item.pipe(map(item => item.filter(items=>items.id === this.productId)));
  }

  async setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    await this.items.subscribe(res => this.product = res[0]);
  }

  async saveProduct(){
    await this.presentLoading();
    console.log(this.product);
    this.isModalOpen = false;
    if(this.productId){
      try{
        await this.productService.updateProduct(this.uid, this.productId, this.product);
        await this.productService.addBrand(this.uid, this.product.brand.toString());
        //this.router.navigate(['home']);
        this.modal.dismiss();
      }catch(error){

      }finally {
        this.loading.dismiss();
      }
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
