import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';

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

     login(user:User){
      return this.afa.signInWithEmailAndPassword(user.email, user.password);
      
     }

     register(user:User){
      return this.afa.createUserWithEmailAndPassword(user.email, user.password);
      
     }

     saveUser(user:User){
      delete user.password;
      delete user.confPassword;
      return this.userCollection.add(user);  

     }

     addStore(idUser, loja, data){
      const newId = this.afs.createId;

      return this.afs.doc('User/'+idUser+'/lojas/'+ newId).set(data);
     }


     logout(){
      return this.afa.signOut();
     }

     getAuth(){
      return this.afa;
     }
}
