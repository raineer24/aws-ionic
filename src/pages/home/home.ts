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

  ionViewWillEnter() {
    this.loadImages();
  }
  loadImages() {
      this.images = [];
      this.awsProvider.getFileList().subscribe(files => {
          for (let name of files) {
            this.awsProvider.getSignedFileRequest(name).subscribe(res => {
                this.images.push({
                  key: name,
                  url: res
                })
            });
          }
      });
  }

  deleteImage(index){
    let toRemove = this.images.splice(index, 1);
    this.awsProvider.deleteFile(toRemove[0]['key']).subscribe(res => {
      let toast = this.toastCtrl.create({
        message: res['msg'],
        duration: 2000
      });
    })
  }

}
