import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class AwsProvider {
  apiUrl = 'http://localhost:5000/';

  constructor(public http: Http) {}
  getSignedUploadRequest(name, type) {
    return this.http.get(`${this.apiUrl}aws/sign?file-name=${name}&file-type=${type}`).map(res => res.json());
  }
  getFileList(): Observable<Array<any>> {
    return this.http.get(`${this.apiUrl}aws/files`)
      .map(res => res.json())
      .map(res => {
        return res["Contents"].map(val => val.Key);
      });
  }
  getSignedFileRequest(name) {
    return this.http.get(`${this.apiUrl}aws/files/${name}`).map(res => res.json());
  }
  deleteFile(name) {
    return this.http
      .delete(`${this.apiUrl}aws/files/${name}`)
      .map(res => res.json());
  }
  randomString = function(length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  uploadFile(url, file) {
    return this.http.put(url, file);
  }
}
