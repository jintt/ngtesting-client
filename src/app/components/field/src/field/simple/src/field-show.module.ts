import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { PipeModule } from '../../../../../../pipe/pipe.module';

import { FieldShowComponent } from './field-show.component';
import { FieldShowLabelComponent } from './field-show-label.component';
import { FieldShowValueComponent } from './field-show-value.component';
import { FieldShowService } from './field-show.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PipeModule],
  declarations: [FieldShowComponent, FieldShowLabelComponent, FieldShowValueComponent],
  exports: [FieldShowComponent, FieldShowLabelComponent, FieldShowValueComponent],
  providers: [FieldShowService]
})
export class FieldShowModule {

}
