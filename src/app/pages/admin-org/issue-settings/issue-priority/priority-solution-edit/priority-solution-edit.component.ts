import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgModule, Pipe, OnInit, AfterViewInit }      from '@angular/core';

import { NgbModalModule, NgbPaginationModule, NgbDropdownModule,
  NgbTabsetModule, NgbButtonsModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { GlobalState } from '../../../../../global.state';

import { CONSTANT } from '../../../../../utils/constant';
import { Utils } from '../../../../../utils/utils';
import { ValidatorUtils, PhoneValidator } from '../../../../../validator';
import { RouteService } from '../../../../../service/route';

import { IssuePrioritySolutionService } from '../../../../../service/admin/issue-priority-solution';
import { PopDialogComponent } from '../../../../../components/pop-dialog';

declare var jQuery;

@Component({
  selector: 'issue-priority-solution-edit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./priority-solution-edit.scss'],
  templateUrl: './priority-solution-edit.html',
})
export class IssuePrioritySolutionEdit implements OnInit, AfterViewInit {

  id: number;

  model: any = {};
  otherItems: any[] = [];

  form: FormGroup;

  @ViewChild('modalWrapper') modalWrapper: PopDialogComponent;

  constructor(private _state: GlobalState, private _routeService: RouteService, private _route: ActivatedRoute,
              private fb: FormBuilder, private issuePrioritySolutionService: IssuePrioritySolutionService) {

  }
  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.id = +params['id'];
    });

    this.loadData();
    this.buildForm();
  }
  ngAfterViewInit() {}

  buildForm(): void {
    this.form = this.fb.group(
      {
        'name': ['', [Validators.required]],
      }, {},
    );

    this.form.valueChanges.debounceTime(CONSTANT.DebounceTime).subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    const that = this;
    that.formErrors = ValidatorUtils.genMsg(that.form, that.validateMsg, []);
  }

  formErrors = [];
  validateMsg = {
    'name': {
      'required': '名称不能为空',
    },
  };

  loadData() {
    const that = this;
    that.issuePrioritySolutionService.get(that.id).subscribe((json: any) => {
      this.model = json.data;
      this.otherItems = json.otherItems;
    });
  }

  save() {
    const that = this;

    that.issuePrioritySolutionService.save(that.model).subscribe((json: any) => {
      if (json.code == 1) {
        that.formErrors = ['保存成功'];
        this.back();
      } else {
        that.formErrors = [json.msg];
      }
    });
  }
  back() {
    this._routeService.navTo('/pages/org-admin/issue-settings/issue-priority/priority-solution-list');
  }

  delete() {
    const that = this;

    that.issuePrioritySolutionService.delete(that.model.id).subscribe((json: any) => {
      if (json.code == 1) {
        that.formErrors = ['删除成功'];
        this.modalWrapper.closeModal();
        this.back();
      } else {
        that.formErrors = ['删除失败'];
      }
    });
  }

  addPriority (item) {
    console.log('add', item);

    this.issuePrioritySolutionService.addPriority(item.id, this.id).subscribe((json: any) => {
      this.model = json.data;
      this.otherItems = json.otherItems;
      this.id = this.model.id;
    });
  }
  removePriority(item) {
    console.log('remove', item);

    this.issuePrioritySolutionService.removePriority(item.id, this.id).subscribe((json: any) => {
      this.model = json.data;
      this.otherItems = json.otherItems;
    });
  }

  addAll () {
    this.issuePrioritySolutionService.addAll(this.id).subscribe((json: any) => {
      this.model = json.data;
      this.otherItems = json.otherItems;
      this.id = this.model.id;
    });
  }
  removeAll() {
    this.issuePrioritySolutionService.removeAll(this.id).subscribe((json: any) => {
      this.model = json.data;
      this.otherItems = json.otherItems;
    });
  }

  showModal(): void {
    this.modalWrapper.showModal();
  }

}

