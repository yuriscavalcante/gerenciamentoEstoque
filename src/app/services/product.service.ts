/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';
import { map, finalize } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  downloadUrl: string;
  private userCollection: AngularFirestoreCollection<User>;
  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    private afs: AngularFirestore,
    private afSto: AngularFireStorage) {
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
      return data;
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
   {;
    const data = {
      url: this.downloadUrl,
      type: product.type,
      brand: product.brand,
      price: product.price,
      model: product.model,
      quantity: product.quantity,
      description: product.description,
      availability: product.availability,
    };
    return this.afs.doc('User/'+uId+'/produtos/'+id).update(data);
   }

   async savePhotoProduct(uid, prodId, image: Blob, product){
    const ref = this.afSto.ref(`${uid}/${prodId}/image.png`);
    const uploadTask = await ref.put(image);
    const url = ref.getDownloadURL();
    url.subscribe(res => this.setUrl(res, uid, prodId, product));
   }

   async updatePhotoProduct(uid, prodId, image: Blob, product){
    const ref = this.afSto.ref(`${uid}/${prodId}/image.png`);
    const deleteRef = this.afSto.ref(`${uid}/${prodId}`);
    await deleteRef.child('/image.png').delete();
    const uploadTask = await ref.put(image);
    const url = ref.getDownloadURL();
    url.subscribe(res => this.setUrl(res, uid, prodId, product));
   }


   setUrl(url, uid, prodId, product){
    this.downloadUrl = url;
    console.log(this.downloadUrl);
    this.updateProduct(uid, prodId, product);
  }
}
