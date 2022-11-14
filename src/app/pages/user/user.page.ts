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
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

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
  selectedImage: any;
  email = '';
  password = '';

  handlerMessage = '';
  roleMessage = '';
  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };
  clickedImage: string;

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private afa: AngularFireAuth,
    private alertController: AlertController,
    private camera: Camera,
    private actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    this.uid = (await this.afa.currentUser).uid;
    this.users = await this.authService.getUser((await this.afa.currentUser).uid);
    this.users.subscribe(res => {this.userRegister = res; this.email = res.email;});
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
  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    };
    const image = await this.camera.getPicture(options);
    // this.selectedImage = 'data:image/jpeg;base64,' + image;
    // let filename = image.substring(image.lastIndexOf('/')+1);
    // let path =  image.substring(0,image.lastIndexOf('/')+1);
    // //then use it in the readAsDataURL method of cordova file plugin
    // //this.file is declared in constructor file :File
    // this.selectedImage = await this.file.readAsDataURL(path, filename);
    // // this.selectedImage = image;
    this.selectedImage = (<any>window).Ionic.WebView.convertFileSrc(image);
  }

  async takePicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'photo',
      buttons: [{
        text: 'From Photos',
        handler: () =>{
          console.log('gallery');
        }
      },{
        text: 'Take Picture',
        handler: () =>{
          console.log('camera');
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: ()=>{
          console.log('cancel');
        }
      }]
    });
    await actionSheet.present();
  }
}
