import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { observable, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public product: Product = {};
  private loading: any;
  public uid;
  private productId: string = null;
  items:Observable<Product[]>;
  item:Observable<Product[]>;


  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private activeteRoute: ActivatedRoute,
  ) { 
    this.productId = this.activeteRoute.snapshot.params['id'];
    console.log(this.productId);
    
    
  }

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    console.log(this.uid);
    
    //this.items.subscribe(val =>console.log(val), error=>console.log("Error"), ()=>console.log("Complete"))
    this.item = this.productService.getProducts(this.uid);
    this.items = this.item.pipe(map(item => item.filter(items=>items.id == this.productId)));
     
    
    //console.log(this.items);

    
  }

  
  async saveProduct(){
    await this.presentLoading();

    if(this.productId){
      try{
        await this.productService.updateProduct(this.uid, this.productId, this.product);
        console.log("ok");

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
