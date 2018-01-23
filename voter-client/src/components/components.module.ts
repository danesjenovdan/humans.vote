import { NgModule } from '@angular/core';
import { ModalIntroComponent } from './modal-intro/modal-intro';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [ModalIntroComponent],
  imports: [IonicModule],
  entryComponents: [ModalIntroComponent],
  exports: [ModalIntroComponent]
})
export class ComponentsModule {
}
