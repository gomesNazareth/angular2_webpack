import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class UploadService {

    public progress$: Observable<any>;
    public progressObserver:BehaviorSubject<any> =new BehaviorSubject(0);
    public progress: number;

    constructor () {
        this.progress$ = Observable.create(observer => {
            this.progressObserver.next(0);
        }).share();
    }

    public  b64toBlob(dataURI) {



        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let fileType = dataURI.split(',')[0].split(':')[1].split(';')[0];
        return new Blob([ab], { type: fileType });
    }


    public makeFileRequest (url,files: File[],AUTH:string,post_root=null,formParams = null,method = "POST",rootTag = "",fileOptional): Observable<any> {


        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            this.progressObserver.next(0);


            for (var key in formParams) {
                if (formParams.hasOwnProperty(key)) {

                    formData.append(rootTag+"["+key+"]", formParams[key]);

                }
            }
            if(formParams != null && formParams.length >0){


                formParams.forEach(selfield => {
                    formData.append("company_member["+selfield["title"]+"]", selfield["value"]);
                })
            }

            if(files) {

                if(post_root != null)
                {
                    formData.append(post_root, this.b64toBlob(files));

                }
                else {
                    formData.append("users[profile_image]", this.b64toBlob(files));

                }

            }


            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                this.progressObserver.next(this.progress);
            };

            xhr.open(method, url, true);
            xhr.setRequestHeader("Authorization", AUTH);
            xhr.send(formData);
        });
    }
}