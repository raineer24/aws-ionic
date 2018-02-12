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

  presentActionSheet() {
      let actionSheet = this.actionSHeetCtrl.create({
        title: 'Select Image Source',
        buttons: [
          {
            text: 'Load from Library',
            handler:() => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel',
            role: 'Cncel'
          }

        ]
      });
      actionSheet.present();
  }

  takePicture(sourceType) {
    //Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourceType
    }

    //Get the picture
    this.camera.getPicture(options).then((ImageData) => {
      let loading = this.loadingCtrl.create();
      loading.present();

      //Resolve the picture URI to a file
      this.file.resolveLocalFilesystemUrl(ImageData).then(oneFile => {
        //Convert the file to an ArrayBuffer for upload
        this.file.readAsArrayBuffer(this.file.tempDirectory, oneFile.name).then(realFile => {
            let type = 'jpg';
            let newName = this.awsProvider.randomString(6) +new Date().getTime() + '.' + type;

            //Get the URL for our PUT request
            this.awsProvider.getSignedUploadRequest(newName, 'image/jpg').subscribe(data => {
              let reqUrl = data.signedRequest;

              //Finally upload the file (arrayBuffer) to AWS
              this.awsProvider.uploadFile(reqUrl, realFile).subscribe(result => {
                this.awsProvider.getSignedFileRequest(newName).subscribe(res => {
                  this.images.push({key: newName, url: res});
                  loading.dismiss();
                });
              });

            });
        }, err => {
          console.log('err: ', err);
        })
      }, (err) => {
          console.log('err: ', err);
      });


    })
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
