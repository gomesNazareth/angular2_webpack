import {Component, Input} from '@angular/core';

@Component({
    selector: 'spinner',
    template: ` 
         <div *ngIf="visible" class="loading"> 
        <img src="/assets/images/logo-horizontal.svg">
        </div>
    `
})
export class SpinnerComponent {
    @Input() visible = true;
}
