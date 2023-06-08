import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './outside-click.directive';


@NgModule({
  declarations: [ClickOutsideDirective],
  exports: [ClickOutsideDirective],
  imports: [
    CommonModule
  ]
})
export class DirectiveModule { }
