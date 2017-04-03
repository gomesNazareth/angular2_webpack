import {Component, Input} from '@angular/core';

@Component({
    selector: 'spinner',
    template: ` 
         <div *ngIf="visible" class="loading"> 
        <img src="images/balls.svg"  >
        </div>
    `
})
export class SpinnerComponent { 
    @Input() visible = true; 
}