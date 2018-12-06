import { Input, Component, OnInit, AfterViewInit } from '@angular/core';

import { FlatpickrOptions } from 'ng2-flatpickr';
// import { Mandarin } from 'flatpickr/dist/l10n/zh';

import { Utils } from '../../../../../utils/utils';

declare var jQuery;

@Component({
  selector: 'input-design',
  templateUrl: './input-design.html',
  styleUrls: ['./styles.scss'],
  providers: [],
})
export class InputDesignComponent implements OnInit, AfterViewInit {

  @Input() elem: any = {};
  @Input() options: any[] = [];
  _model: any = {};

  public constructor() {

  }

  public ngOnInit(): void {
    if (this.options) {
      const defaults: any[] = this.options.filter(
        (option, index) => option.isDefault == true);
      if (defaults.length > 0) {
        this._model[this.elem.code] = defaults[0].id;
      }
    }
  }

  ngAfterViewInit() {
    jQuery('.my-flatpickr-date').flatpickr();
    jQuery('.my-flatpickr-time').flatpickr();
    jQuery('.my-flatpickr-datetime').flatpickr({});
  }

}
