import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RolePage } from './role';

@NgModule({
  declarations: [
    RolePage,
  ],
  imports: [
    IonicPageModule.forChild(RolePage),
  ],
})
export class RolePageModule {}
