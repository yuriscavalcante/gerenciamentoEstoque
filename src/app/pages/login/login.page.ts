/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
//import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition: number = 0;
  private wavesDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;
  handlerMessage = '';
  roleMessage = '';
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertController: AlertController
    //public keyboard: Keyboard
  ) { }

  ngOnInit() { }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async register() {
    await this.presentLoading();
    if(this.userRegister.age != 0 && this.userRegister.name != '' && this.userRegister.email != '' && this.userRegister.password != '' && this.userRegister.lastName != ''
    && this.userRegister.confPassword != '' && this.userRegister.password == this.userRegister.confPassword ){
      try {
        await this.authService.register(this.userRegister);
        await this.authService.saveUser(this.userRegister);
      } catch (error) {
        let message: string;
        switch(error.code){
          case 'auth/email-already-in-use':
          message = 'Email j?? est?? sendo usado!';
          break;
        }
        this.presentToast(message);
      } finally {
        this.loading.dismiss();
      }
    }
    else if(this.userRegister.age != 0 && this.userRegister.name != '' && this.userRegister.email != '' && this.userRegister.password != '' && this.userRegister.lastName != ''
    && this.userRegister.confPassword != '' && this.userRegister.password != this.userRegister.confPassword ){
      this.presentToast("Senhas n??o combinam!");
      this.loading.dismiss();
    }
    else{
      this.presentToast("Preencha todos os campos!");
      this.loading.dismiss();
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

  async login() {
    await this.presentLoading();

    if(this.userLogin.email != '' && this.userLogin.password != ''){
      try {
        await this.authService.login(this.userLogin);
        this.userLogin = {};
        //console.log("Ok");
      } catch (error) {
        this.presentToast(error.message);
      } finally {
        this.loading.dismiss();
      }
    }else{
      this.presentToast("Preencha todos os campos!");
      this.loading.dismiss();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Digite seu E-mail',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (alertData) => {
            this.handlerMessage = 'Alert confirmed';
            try{
              this.authService.resetPassword(alertData.email);
            }catch (error) {
              console.error(error);
            }finally {
            }
          },
        },
      ],
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail',
          type: 'email'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }
}
