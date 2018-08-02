import { Component, ViewEncapsulation, NgModule, Pipe, Input, Compiler, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgbDatepickerI18n, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { I18n, CustomDatepickerI18n } from '../../../../service/datepicker-I18n';

import { GlobalState } from '../../../../global.state';

import { CONSTANT } from '../../../../utils/constant';
import { Utils, logger } from '../../../../utils/utils';
import { ValidatorUtils, CustomValidator } from '../../../../validator';
import { RouteService } from '../../../../service/route';

import { PlanService } from '../../../../service/plan';
import { TaskService } from '../../../../service/task';
import { CaseService } from '../../../../service/case';
import { UserService } from '../../../../service/user';

import { CaseSelectionComponent } from '../../../../components/case-selection';
import { EnvironmentConfigComponent } from '../../../../components/environment-config';
import { PopDialogComponent } from '../../../../components/pop-dialog';

import { TaskEditComponent } from '../../task/edit';

declare var jQuery;
import * as _ from 'lodash';

@Component({
  selector: 'plan-edit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit.scss',
    '../../../../../assets/vendor/ztree/css/zTreeStyle/zTreeStyle.css',
    '../../../../components/ztree/src/styles.scss'],
  templateUrl: './edit.html',
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
})
export class PlanEdit implements OnInit, AfterViewInit {
  orgId: number;
  prjId: number;
  caseProjectId: number;
  planId: number;

  treeSettings: any = { usage: 'selection', isExpanded: true, sonSign: false };

  startDate: any;
  model: any = { verId: 'null', tasks: [] };
  vers: any = [];
  envs: any = [];

  suites: any[] = [];
  task: any = {};
  taskIndex: number;
  form: FormGroup;

  @ViewChild('modalSelectCase') modalSelectCase: CaseSelectionComponent;

  @ViewChild('modalDelete') modalDelete: PopDialogComponent;
  @ViewChild('modalConfigEnvi') modalConfigEnvi: PopDialogComponent;
  @ViewChild('modalRemoveSet') modalRemoveSet: PopDialogComponent;
  testSet: any;
  modalTitle: string;

  taskEditModal: any;
  caseSelectionModal: any;
  envSelectionModal: any;

  constructor(private _state: GlobalState, private _routeService: RouteService,
              private _route: ActivatedRoute, private fb: FormBuilder,
              private _i18n: I18n, private modalService: NgbModal, private compiler: Compiler,
              private ngbDateParserFormatter: NgbDateParserFormatter,
              private _planService: PlanService, private _taskService: TaskService,
              private _caseService: CaseService, private _userService: UserService) {


  }
  ngOnInit() {
    this.orgId = CONSTANT.CURR_ORG_ID;
    this.prjId = CONSTANT.CURR_PRJ_ID;

    this._route.params.forEach((params: Params) => {
      this.planId = +params['planId'];
    });

    this.loadData();

    this.buildForm();

    const now = new Date();
    this.startDate = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
  }
  ngAfterViewInit() {}

  buildForm(): void {
    this.form = this.fb.group(
      {
        'name': ['', [Validators.required]],
        'descr': ['', []],
        'estimate': ['', []],
        'startTime': ['', []],
        'verId': ['', []],
        'endTime': ['', []],
        'disabled': ['', []],
      }, {
        validator: CustomValidator.compareDate('dateCompare', 'startTime', 'endTime'),
      },
    );

    this.form.valueChanges.debounceTime(CONSTANT.DebounceTime).subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    this.formErrors = ValidatorUtils.genMsg(this.form, this.validateMsg, ['dateCompare']);
  }

  formErrors = [];
  validateMsg = {
    'name': {
      'required': '名称不能为空',
    },

    dateCompare: '结束时间必须大于或等于开始时间',
  };

  loadData() {
    const that = this;
    that._planService.get(CONSTANT.CURR_PRJ_ID, this.planId).subscribe((json: any) => {
      that.model = json.data ? json.data : { verId: 'null', tasks: [] };
      that.suites = json.suites;
      that.vers = json.vers;
      that.envs = json.envs;

      this.model.startTime = this.ngbDateParserFormatter.parse(that.model.startTime);
      this.model.endTime = this.ngbDateParserFormatter.parse(that.model.endTime);
    });
  }

  save() {
    this._planService.save(this.prjId, this.model).subscribe((json: any) => {
      if (json.code == 1) {
        this._routeService.navTo('/pages/org/' + this.orgId + '/prj/'
          + this.prjId + '/implement/plan/list');
      } else {
        this.formErrors = [json.msg];
      }
    });
  }

  reset() {
    this.loadData();
  }

  editTask(task?: any, index?: number) {
    this.compiler.clearCacheFor(TaskEditComponent);
    this.taskEditModal = this.modalService.open(TaskEditComponent, { windowClass: 'pop-modal' });

    if (!task) {
      this.task = { envId: '', assignees: [] };
      this.taskIndex = this.model.tasks.length;
    } else {
      this.task = task;
      this.taskIndex = index;
    }
    this.taskEditModal.componentInstance.selectedModels = this.task.assignees;
    this.taskEditModal.componentInstance.model = this.task;
    this.taskEditModal.componentInstance.suites = this.suites;
    this.taskEditModal.componentInstance.envs = this.envs;

    this.taskEditModal.result.then((result) => {
      this.model.userIds = result.data.userIds;
      this.saveTask();
    }, (reason) => {
      logger.log('reason', reason);
    });

  }
  saveTask() {
    if (!this.model.id) {
      this._planService.save(this.prjId, this.model).subscribe((json: any) => {
        if (json.code == 1) {
          this.planId = json.data.id;
          this.model.id = json.data.id;

          this._saveTask();
        } else {
          this.formErrors = [json.msg];
        }
      });
    } else {
      this._saveTask();
    }
  }
  _saveTask() {
    this._taskService.saveTask(this.prjId, this.planId, this.task, this.suites).subscribe((json: any) => {
      this.model.tasks[this.taskIndex] = json.data;
    });
  }

  editTaskCases(task: any, index: number) {

    this.compiler.clearCacheFor(CaseSelectionComponent);
    this.caseSelectionModal = this.modalService.open(CaseSelectionComponent, { windowClass: 'pop-modal' });

    this.caseSelectionModal.componentInstance.selectFor = 'task';
    this.caseSelectionModal.componentInstance.treeSettings = this.treeSettings;
    this.caseSelectionModal.componentInstance.projectId = task.projectId;
    this.caseSelectionModal.componentInstance.caseProjectId = task.caseProjectId ? task.caseProjectId : task.prjId;
    this.caseSelectionModal.componentInstance.taskId = task.id;

    this._userService.getUsers(CONSTANT.CURR_PRJ_ID).subscribe((json: any) => {
      this.caseSelectionModal.componentInstance.users = json.data;
    });

    this.caseSelectionModal.result.then((result) => {
      const taskId = task ? task.id : undefined;
      this.saveTaskCases(result.projectId, result.caseProjectId, taskId, result.data, index);
    }, (reason) => {
      logger.log('reason', reason);
    });
  }
  saveTaskCases(projectId: number, caseProjectId: number, taskId: any, cases: any[], index: number): void {
    this._taskService.saveTaskCases(projectId, caseProjectId, this.planId, taskId, cases).subscribe((json: any) => {
      this.model.tasks[index] = json.data;
    });
  }

  delete(): void {
    this.modalTitle = '确认删除';
    this.modalDelete.showModal();
  }
  deleteConfirm() {
    this._planService.delete(this.model.id).subscribe((json: any) => {
      if (json.code == 1) {
        this.formErrors = ['删除成功'];
        this.modalDelete.closeModal();

        this._routeService.navTo('/pages/org/' + CONSTANT.CURR_ORG_ID + '/prj/'
          + CONSTANT.CURR_PRJ_ID + '/implement/plan/list');
      } else {
        this.formErrors = ['删除失败'];
      }
    });
  }

  removeSet(testSet: any): void {
    this.modalTitle = '确认删除';
    this.testSet = testSet;
    this.modalRemoveSet.showModal();
  }
  removeSetConfirm() {
    this._taskService.delete(this.testSet.id).subscribe((json: any) => {
      if (json.code == 1) {
        this.formErrors = ['删除成功'];
        this.modalRemoveSet.closeModal();

        this.model.tasks = this.model.tasks.filter((item: any) => {
          return item.id != this.testSet.id;
          });

      } else {
        this.formErrors = ['删除失败'];
      }
    });
  }

  endTimeChanged() {
    console.log('===', this.model);
  }

}

