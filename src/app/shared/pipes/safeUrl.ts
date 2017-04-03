// Safe URL
import {PipeTransform, Pipe} from '@angular/core'
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {}
  transform(url:string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
