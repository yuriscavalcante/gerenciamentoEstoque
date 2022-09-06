import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/interfaces/store';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-store-register',
  templateUrl: './store-register.page.html',
  styleUrls: ['./store-register.page.scss'],
})
export class StoreRegisterPage implements OnInit {

  public name: Store = {};
  public uid: any;

  constructor(
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.uid = (await this.authService.getAuth().currentUser).uid;
  }


 async cadStore(){
  this.authService.addStore(this.uid, this.name);
 }

}
