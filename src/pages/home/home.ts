import { File} from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import {
  AwsProvider
} from './../../providers/aws/aws';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images = [];

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private awsProvider : AwsProvider, private actionSHeetCtrl: ActionSheetController, private file: File, private camera: Camera) {

  }

}
