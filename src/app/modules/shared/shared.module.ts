import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from 'src/safe.pipe';



@NgModule({
  declarations: [SafePipe],
  imports: [
    // SafePipe,
    CommonModule
  ],
  exports:[SafePipe]
})
export class SharedModule { }
