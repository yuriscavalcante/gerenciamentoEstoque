import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Store } from '../interfaces/store';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
 
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore)
     {
      this.userCollection = this.afs.collection<User>('User');
      }

      public uid: string;

     login(user:User){
      return this.afa.signInWithEmailAndPassword(user.email, user.password);
      
     }

    async register(user:User){
      await this.afa.createUserWithEmailAndPassword(user.email, user.password);
      this.uid = (await (this.afa.currentUser)).uid
      
     }

     async saveUser(user:User){
      delete user.password;
      delete user.confPassword;
      return this.afs.doc('User/' + this.uid).set(user);  

     }

     async addStore(idUser, loja: Store){
       const newId = this.afs.createId();

       await this.afs.doc('User/'+idUser+'/lojas/'+newId).set(loja);
     }


     logout(){
      return this.afa.signOut();
     }

     getAuth(){
      return this.afa;
     }

    getInfo(uid){
        const userDoc = this.afs.doc<User>('User/'+uid);
        return userDoc.collection<Store>('lojas/').valueChanges();
        //return this.afs.doc<User>('user/'+ uid).collection<Store>('lojas').valueChanges();
        //return this.afs.collection('user/'+uid+'/lojas').valueChanges(); 
        //return this.userCollection.valueChanges({idField: 'id'});
        //return this.afs.doc('user/'+uid+'/lojas').valueChanges();
      }
}
