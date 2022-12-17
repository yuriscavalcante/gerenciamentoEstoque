/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable object-shorthand */
import { ActionSheetController } from '@ionic/angular';
/* eslint-disable eol-last */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/interfaces/user';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public userRegister: User = {};
  public users: Observable<User>;
  public user: any;
  public uid;
  private loading: any;
  isDesktop: boolean;
  type = 'gallery';
  photos: Blob;
  selectedImage: any;
  email = '';
  password = '';
  imageSrc: any = undefined;

  handlerMessage = '';
  roleMessage = '';

  clickedImage: string;

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    this.users = await this.authService.getUser((await this.afa.currentUser).uid);
    this.users.subscribe(res => {this.userRegister = res; this.email = res.email;
    this.imageSrc = res.url;});
    this.imageSrc = this.userRegister.url;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async logout() {
    await this.presentLoading();
    try {
      await this.authService.logout();
      this.uid = '';
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  cancel() {
    this.modal.dismiss(null, 'Fechar');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Digite sua senha',
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
              this.authService.updateUserAuth(this.email, alertData.password, this.userRegister.email);
              this.authService.updateUserData(this.userRegister, this.uid);
              this.cancel();
            }catch (error) {
              console.error(error);
            }finally {
            }
          },
        },
      ],
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha',
          type: 'password'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  async getPicture() {
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && this.type === 'gallery')) {
      return;
    }
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,

    });
    this.imageSrc = image.dataUrl;
    this.photos = await this.convertBase64ToBlob(this.imageSrc);
    this.sendImage(this.photos);
  }

  public async convertBase64ToBlob(imageBase64: string) {
    const response = await fetch(imageBase64);
    const blob = await response.blob();
    return blob;
  }

  async sendImage(image){
    //this.presentLoading();
    const fd = new FormData();
    fd.append('imagem', image, this.uid);
    const res = await this.authService.saveAvatar(this.uid, this.userRegister, image);
    //this.loading.dismiss();
  }


}
