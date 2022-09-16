import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private userCollection: AngularFirestoreCollection<User>;
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    private afs: AngularFirestore) {
    this.productCollection = this.afs.collection<Product>('product');
   }



   async addProduct(uId,product: Product)
   {
    const newId = this.afs.createId();
    const data = {
      url: product.url,
      type: product.type,
      brand: product.brand,
      price: product.price,
      model: product.model,
      quantity: product.quantity,
      description: product.description,
      availability: product.availability,
      id: newId
    };
    if(product.quantity>0){
      data.availability = true;
      await this.afs.doc('User/'+uId+'/emEstoque/'+newId).set(data);
    }else{
      data.availability = false;
      await this.afs.doc('User/'+uId+'/semEstoque/'+newId).set(data);
    }


    
   }

   async getProduct(id){
    return this.productCollection.doc<Product>(id).valueChanges();
   }

   async addBrand(uId, product: Product){
    const newId = this.afs.createId();
    await this.afs.doc('User/'+uId+'/marcas/').set(product.brand);
   }

   getProducts(uId)
   {
    const userDoc = this.afs.doc<User>('User/'+uId);
    return userDoc.collection<Product>('produtos/').valueChanges();
   }

   async updateProduct(uId, id: string, product: Product)
   {
    const data = {
      url: product.url,
      type: product.type,
      brand: product.brand,
      price: product.price,
      model: product.model,
      quantity: product.quantity,
      description: product.description,
      availability: product.availability
      };
      if(product.quantity>0){
        data.availability = true;
        await this.afs.doc('User/'+uId+'/emEstoque/'+id).set(data);
      }else{
        data.availability = false;
        await this.afs.doc('User/'+uId+'/semEstoque/'+id).set(data);
      }
   }

   deleteProduct(id: string)
   {

   }
}
