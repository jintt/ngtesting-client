import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule, NgbPaginationModule, NgbDropdownModule, NgbDateParserFormatter,
  NgbTabsetModule, NgbButtonsModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { PopDialogModule } from '../../../components/pop-dialog';

import { PipeModule } from '../../../pipe/pipe.module';
import { DateFormatPipe } from '../../../pipe/date';
import { SearchSelectModule } from '../../../components/search-select';

import { CommentsService } from '../../../service/client/comments';

import { FileUploaderModule } from '../../file-uploader';
import { CommentsModule } from '../../comments';

import { FieldModule } from '../../field';

import { IssuePage } from './issue-page/issue-page.component';

import { IssueEdit } from './issue-edit/issue-edit.component';
import { IssueAssign } from './issue-assign/issue-assign.component';
import { IssueWatch } from './issue-watch/issue-watch.component';
import { IssueTag } from './issue-tag/issue-tag.component';
import { IssueLink } from './issue-link/issue-link.component';

import { IssueEditService } from './issue-edit/issue-edit.service';
import { IssueAssignService } from './issue-assign/issue-assign.service';
import { IssueWatchService } from './issue-watch/issue-watch.service';
import { IssueTagService } from './issue-tag/issue-tag.service';
import { IssueLinkService } from './issue-link/issue-link.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule, NgbTabsetModule,
    PipeModule, PopDialogModule,
    SearchSelectModule,
    FileUploaderModule, FieldModule, CommentsModule,
  ],
  declarations: [
    IssuePage, IssueEdit, IssueAssign, IssueWatch, IssueTag, IssueLink,
  ],
  exports: [
    IssuePage, IssueEdit, IssueAssign, IssueWatch, IssueTag, IssueLink,
  ],
  providers: [DateFormatPipe, CommentsService,
    IssueEditService, IssueAssignService, IssueWatchService, IssueTagService, IssueLinkService],
  entryComponents: [
    IssueEdit, IssueAssign, IssueWatch, IssueTag, IssueLink,
  ],
})
export class IssueCompModule {

}