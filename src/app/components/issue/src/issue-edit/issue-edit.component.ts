import { Component, ViewEncapsulation, Input, Pipe, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyToastyService } from '../../../../service/my-toasty';

import { GlobalState } from '../../../../global.state';

import { CONSTANT } from '../../../../utils/constant';
import { ValidatorUtils } from '../../../../validator/validator.utils';

import { RouteService } from '../../../../service/route';
import { IssueService } from '../../../../service/client/issue';

import { PrivilegeService } from '../../../../service/privilege';
import * as _ from 'lodash';
import { Utils } from '../../../../utils';

declare var jQuery;

@Component({
  selector: 'issue-edit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./issue-edit.scss'],
  templateUrl: './issue-edit.html',
})
export class IssueEdit implements OnInit, AfterViewInit, OnDestroy {
  eventCode: string = 'IssueEdit';
  canEdit: boolean;

  _id: number;
  set id(val: any) {
    this._id = val;
    console.log('id', this._id);
    this.loadData();
  }

  issue: any = {};
  issuePropMap: any = {};

  page: any = {};

  form: any;
  validateMsg: any = {};

  constructor(private _routeService: RouteService, private _state: GlobalState, private _route: ActivatedRoute,
              public activeModal: NgbActiveModal, private fb: FormBuilder, private toastyService: MyToastyService,
              private issueService: IssueService, private privilegeService: PrivilegeService) {

    this.canEdit = this.privilegeService.hasPrivilege('issue-update');

    this.buildForm();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {}

  loadData() {
    this.issueService.edit(this._id).subscribe((json: any) => {
      this.issue = json.data;

      this.page = json.page;

      this.onValueChanged();
    });
  }

  update() {
    const data = _.clone(this.issue);
    this.issueService.update(data, this.page.id).subscribe((json: any) => {
      if (json.code == 1) {
        this.activeModal.close({ act: 'update', success: true });
      }
    });
  }

  cancel() {
      this.activeModal.dismiss({ act: 'cancel' });
  }

  onValueChanged(data?: any) {
    console.log('onValueChanged');
    this.formErrors = ValidatorUtils.genMsg(this.form, this.validateMsg, []);
  }

  buildForm() {
    this.form = this.fb.group({});

    this.form.valueChanges.debounceTime(CONSTANT.DebounceTime).subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  formErrors = [];

  ngOnDestroy(): void {

  }

}

