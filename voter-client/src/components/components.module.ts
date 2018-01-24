import { NgModule } from '@angular/core';
import { ModalIntroComponent } from './modal-intro/modal-intro';
import { IonicModule } from 'ionic-angular';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ModalContractViewComponent } from './modal-contract-view/modal-contract-view';
import { BrowserModule } from '@angular/platform-browser';
import { ModalContractFunctionViewComponent } from './modal-contract-function-view/modal-contract-function-view';

@NgModule({
  declarations: [
    ModalIntroComponent,
    ModalContractViewComponent,
    ModalContractFunctionViewComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule,
    NgxQRCodeModule
  ],
  entryComponents: [ModalIntroComponent, ModalContractViewComponent, ModalContractFunctionViewComponent],
  exports: [
    ModalIntroComponent,
    ModalContractViewComponent,
    ModalContractFunctionViewComponent,
  ]
})
export class ComponentsModule {
}
