import * as _ from 'lodash';

import {Injectable} from "@angular/core";

import { Cookie } from 'ng2-cookies/ng2-cookies';
import {GlobalState} from '../global.state';

import { CONSTANT } from '../utils/constant';
import { RouteService } from './route';
import {RequestService} from "./request";

@Injectable()
export class RoleService {
  constructor(private _reqService: RequestService) { }
  _api_url = 'role/';

  list(query: any) {
    return this._reqService.post(this._api_url + 'list', query);
  }

  get(id: number) {
    let model = {id: id};
    return this._reqService.post(this._api_url + 'get', model);
  }

  save(model: any) {
    return this._reqService.post(this._api_url + 'save', {role: model});
  }

  delete(id: number) {
    let model = {id: id};
    return this._reqService.post(this._api_url + 'delete', model);
  }
}

