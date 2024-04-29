import { HttpClient, HttpHeaders } from '@angular/common/http';

export class UploadAdapter {
  loader: any;
  xhr: any;

  constructor(loader, private rowID, private tableType) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open(
      'POST',
      `https://dev.iraniexpert.com/api/Files/UploadCKEditor?TableType=${this.tableType}&RowId=${this.rowID}`,
      true
    ); // TODO change the URL
    xhr.responseType = 'json';

    xhr.setRequestHeader(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
    );
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Expires', '0');
  }
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }
      resolve({
        default: response.url,
      });
    });
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
  _sendRequest(file) {
    const data = new FormData();
    data.append('File', file);
    this.xhr.send(data);
  }
}
