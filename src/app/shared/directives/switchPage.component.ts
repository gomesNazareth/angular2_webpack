import {Component, Input} from '@angular/core';

@Component({
    selector: 'switch-page',
    template: `
      <div id="demo-content">
           <div id="loader-wrapper">
            <i><img src="images/loading-logo.svg"></i>
            <div id="loader-main-page"></div>
           </div>
      </div>
    `
})
export class SwitchPageComponent {
    @Input() visible = true;
}