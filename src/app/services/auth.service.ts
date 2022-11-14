import { Observable } from 'rxjs';
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Store } from '../interfaces/store';
import { User } from '../interfaces/user';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
  public uid: string;
  public user: any;
  auth = getAuth();
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore)
     {
      this.userCollection = this.afs.collection<User>('User');
      }

      async login(user: User){
      await this.afa.signInWithEmailAndPassword(user.email, user.password);
      this.uid = (await (this.afa.currentUser)).uid;
     }

    async register(user: User){
      await this.afa.createUserWithEmailAndPassword(user.email, user.password);
      this.uid = (await (this.afa.currentUser)).uid;
     }

     async saveUser(user: User){
      delete user.password;
      delete user.confPassword;
      return this.afs.doc('User/'+this.uid).set(user);
     }

     async updateUserData(user: User, uid){
      delete user.password;
      delete user.confPassword;
      return this.afs.doc('User/'+uid).update(user);
     }

     async updateUserAuth(email, password, newEmail){
      this.afa.signInWithEmailAndPassword(email, password).then((res)=>{
        res.user.updateEmail(newEmail);
      });
     }

     async resetPassword(email){
      this.afa.sendPasswordResetEmail(email);
     }

     async addStore(idUser, loja: Store){
       const newId = this.afs.createId();
       const data = {
        name: loja.name,
        id: newId
       };

       await this.afs.doc('User/'+idUser+'/lojas/'+newId).set(data);
     }

     async getUser(uid: string){
      const docRef = this.afs.doc<User>('User/'+uid).valueChanges();
      return docRef;
     }

     logout(){
      this.uid = '';
      return this.afa.signOut();
     }

     getAuths(){
      return this.afa;
     }

    getInfo(uid){
        const userDoc = this.afs.doc<User>('User/'+uid);
        return userDoc.collection<Store>('lojas/').valueChanges();
      }
}
