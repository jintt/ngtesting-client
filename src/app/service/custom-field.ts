import * as _ from 'lodash';

import {Injectable} from "@angular/core";

import {RequestService} from "./request";

@Injectable()
export class CustomFieldService {
  constructor(private _reqService: RequestService) { }
  _api_url = 'custom_field/';

  list() {
    return this._reqService.post(this._api_url + 'list', {});
  }

  get(id: number) {
    let model = {id: id};
    return this._reqService.post(this._api_url + 'get', model);
  }

  save(model: any, relations: any[]) {
    return this._reqService.post(this._api_url + 'save', {model: model, relations: relations});
  }

  delete(id: number) {
    let model = {id: id};
    return this._reqService.post(this._api_url + 'delete', model);
  }

  changeOrder(id: number, act: string) {
    let model = {id: id, act: act};
    return this._reqService.post(this._api_url + 'changeOrder', model);
  }
}

