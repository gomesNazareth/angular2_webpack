import {Component, Input,Inject,EventEmitter,Output,OnInit} from '@angular/core';
import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
    selector: '[focus]'
})
export class FocusDirective {
    @Input()
    focus:boolean;
    constructor(@Inject(ElementRef) public element: ElementRef) {}
    public ngOnChanges(_changes) {
        this.element.nativeElement.focus();
    }
}
