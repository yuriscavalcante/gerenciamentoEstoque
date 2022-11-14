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
      type: product.type.toUpperCase(),
      brand: product.brand.toUpperCase(),
      price: product.price,
      model: product.model.toUpperCase(),
      quantity: product.quantity,
      description: product.description,
      id: newId
    };
      await this.afs.doc('User/'+uId+'/produtos/'+newId).set(data);
   }

   async getProduct(uId){
    const userDoc = this.afs.doc<User>('User/'+uId);
    return userDoc.collection<Product[]>('produtos/').valueChanges();
   }

   async addBrand(uId, brand: string){
    const newId = this.afs.createId();
    await this.afs.doc('User/'+uId+'/marcas/'+newId).set(brand);
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
      availability: product.availability,
    };
    return this.afs.doc('User/'+uId+'/produtos/'+id).update(product);
   }

   deleteProduct(id: string)
   {

   }
}
