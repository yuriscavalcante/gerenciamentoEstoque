import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    private afs: AngularFirestore) {
    this.productCollection = this.afs.collection<Product>('product');
   }

   getProducts()
   {
      return this.productCollection.snapshotChanges().pipe(
        map(actions =>{
          return actions.map(a =>{
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return {id, ...data};
          });
        })
      )
   }

   addProduct(product: Product)
   {
    
   }

   getProduct(id: string)
   {
    
   }

   updateProduct(id: string, product: Product)
   {
    
   }

   deleteProduct(id: string)
   {

   }
}
