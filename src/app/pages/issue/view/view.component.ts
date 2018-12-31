import { Component, ViewEncapsulation, NgModule, Pipe, OnInit, AfterViewInit, OnDestroy, Input }
  from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { GlobalState } from '../../../global.state';

import { RouteService } from '../../../service/route';
import { CONSTANT } from '../../../utils/constant';

import { PrivilegeService } from '../../../service/privilege';
import { IssueService } from '../../../service/client/issue';

declare var jQuery;

@Component({
  selector: 'issue-view',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view.scss'],
  templateUrl: './view.html',
})
export class IssueView implements OnInit, AfterViewInit, OnDestroy {
  eventCode: string = 'IssueView';
  canEdit: boolean;

  id: number;
  page: any = {};
  issue: any = {};
  issuePropMap: any = {};
  issueTransMap: any = {};

  routeSub: any;

  constructor(private _routeService: RouteService, private _route: ActivatedRoute, private _state: GlobalState,
              private fb: FormBuilder, private toastyService: ToastyService,
              private issueService: IssueService, private privilegeService: PrivilegeService) {
    this.issuePropMap = CONSTANT.ISU_PROPERTY_MAP;

    this.canEdit = this.privilegeService.hasPrivilege('issue-update');

    this.routeSub = this._route.params.subscribe((params: Params) => {
      this.id = +params['id'];

      console.log('id', params, this.id);
      this.loadData();
    });
  }
  ngOnInit() {

  }

  ngAfterViewInit() {}

  loadData() {
    this.issueService.view(this.id).subscribe((json: any) => {
      this.issue = json.data;
      this.page = json.page;
      this.issuePropMap = json.issuePropMap;
      this.issueTransMap = json.issueTransMap;
      CONSTANT.ISU_PROPERTY_VAL_MAP = json.issuePropValMap;
    });
  }

  getData() {
    this.issueService.getData(this.id).subscribe((json: any) => {
      this.issue.links = json.data.links;
      this.issue.tags = json.data.tags;
      this.issue.histories = json.data.histories;
    });
  }

  optResult($event) {
    console.log('$event', $event);
    if ($event.act == 'update' || $event.act == 'updateField' || $event.act == 'tran') {
      this.loadData();
    } else if ($event.act == 'delete') {
      this.back();
    } else if ($event.act == 'link' || $event.act == 'tag' || $event.act == 'watch') {
      this.getData();
    }
  }

  back() {
    this.issueService.gotoList();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}

