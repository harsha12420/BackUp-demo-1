import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { REDIRECT_ROUTE_PATH, ROUTE_PATH } from 'src/app/Constants/constants';
import { superAdminGuard } from 'src/app/guards/super-admin.guard';
import { schoolAdminGuard } from 'src/app/guards/school-admin.guard';
import { organizationGuard } from 'src/app/guards/organization.guard';
import { StandardDocumentComponent } from './standard-document/standard-document.component';
const routes: Routes = [
  {
    path: 'admin',
    component: UserComponent,
    children: [
      {
        path: ROUTE_PATH.ABSOLUTE,
        redirectTo: ROUTE_PATH.DASHBOARD,
        pathMatch: 'full',
      },
      {
        path: ROUTE_PATH.DASHBOARD,
        component: DashboardComponent,
      },
      {
        path: 'organization',
        loadChildren: () =>
          import('./organization/organization.module').then(
            (m) => m.OrganizationModule
          ),
        canActivate: [superAdminGuard],
      },
      {
        path: 'states',
        loadChildren: () =>
          import('./admission/state/state.module').then((m) => m.StateModule),
        canActivate: [superAdminGuard],
      },
      {
        path: 'district',
        loadChildren: () =>
          import('./district/district.module').then((m) => m.DistrictModule),
        canActivate: [superAdminGuard],
      },
      {
        path: 'sub-district',
        loadChildren: () =>
          import('./sub-district/sub-district.module').then(
            (m) => m.SubDistrictModule
          ),
        canActivate: [superAdminGuard],
      },
      {
        path: 'vilage',
        loadChildren: () =>
          import('./vilage/vilage.module').then((m) => m.VilageModule),
        canActivate: [superAdminGuard],
      },
      {
        path: 'pincode',
        loadChildren: () =>
          import('./pincode/pincode.module').then((m) => m.PincodeModule),
        canActivate: [superAdminGuard],
      },
      {
        path: 'school',
        loadChildren: () =>
          import('./school/school.module').then((m) => m.SchoolModule),
        canActivate: [organizationGuard],
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./staff/staff.module').then((m) => m.StaffModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'holiday',
        loadChildren: () =>
          import('./holiday/holiday.module').then((m) => m.HolidayModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./task/task.module').then((m) => m.TaskModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'group',
        loadChildren: () =>
          import('./group/group.module').then((m) => m.GroupModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'follow-up',
        loadChildren: () =>
          import('./follow-up/follow-up.module').then((m) => m.FollowUpModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'work-status',
        loadChildren: () =>
          import('./work-status/work-status.module').then(
            (m) => m.WorkStatusModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'observation-type',
        loadChildren: () =>
          import('./observation-type/observation-type.module').then(
            (m) => m.ObservationTypeModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'job-round',
        loadChildren: () =>
          import('./job-round/job-round.module').then((m) => m.JobRoundModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'medium',
        loadChildren: () =>
          import('./medium/medium.module').then((m) => m.MediumModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'division',
        loadChildren: () =>
          import('./division/division.module').then((m) => m.DivisionModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'designtion',
        loadChildren: () =>
          import('./designtion/designtion.module').then(
            (m) => m.DesigntionModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'standard',
        loadChildren: () =>
          import('./standard/standard.module').then((m) => m.StandardModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'exam',
        loadChildren: () =>
          import('./exam/exam.module').then((m) => m.ExamModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'subject',
        loadChildren: () =>
          import('./subject/subject.module').then((m) => m.SubjectModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'subject-category',
        loadChildren: () =>
          import('./subject-category/subject-category.module').then(
            (m) => m.SubjectCategoryModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'medium-wise-subject-priority',
        loadChildren: () =>
          import(
            './medium-subject-priority/medium-subject-priority.module'
          ).then((m) => m.MediumSubjectPriorityModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'medium-standard-wise-subject-assignment',
        loadChildren: () =>
          import(
            './medium-standard-subject-assignment/medium-standard-subject-assignment.module'
          ).then((m) => m.MediumStandardSubjectAssignmentModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'student-wise-optional-subject-assignment',
        loadChildren: () =>
          import(
            './stud-wise-optional-sub-assignment/stud-wise-optional-sub-assignment.module'
          ).then((m) => m.StudWiseOptionalSubAssignmentModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'student-leave-from-master',
        loadChildren: () =>
          import('./student-exit/student-exit.module').then(
            (m) => m.StudentExitModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'fees',
        loadChildren: () =>
          import('./fees/fees.module').then((m) => m.FeesModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'subject-wise-lesson-planning',
        loadChildren: () =>
          import(
            './subject-wise-lesson-planning/subject-wise-lesson-planning.module'
          ).then((m) => m.SubjectWiseLessonPlanningModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'lesson-wise-topic-subtopic-entry',
        loadChildren: () =>
          import(
            './lesson-wise-topic-subtopic-entry/lesson-wise-topic-subtopic-entry.module'
          ).then((m) => m.LessonWiseTopicSubtopicEntryModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'lo-level',
        loadChildren: () =>
          import('./topic-wise-lo-entry/topic-wise-lo-entry.module').then(
            (m) => m.TopicWiseLoEntryModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'topic-wise-lo',
        loadChildren: () =>
          import('./topic-wise-lo/topic-wise-lo.module').then(
            (m) => m.TopicWiseLoModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'question-type-master',
        loadChildren: () =>
          import('./question-type-master/question-type-master.module').then(
            (m) => m.QuestionTypeMasterModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'question-difficulty-level-master',
        loadChildren: () =>
          import(
            './question-difficulty-level-master/question-difficulty-level-master.module'
          ).then((m) => m.QuestionDifficultyLevelMasterModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'lo-wise-questions',
        loadChildren: () =>
          import('./lo-wise-question/lo-wise-question.module').then(
            (m) => m.LoWiseQuestionModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'class',
        loadChildren: () =>
          import('./class/class.module').then((m) => m.ClassModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'common-resource',
        loadChildren: () =>
          import('./common-resource/common-resource.module').then(
            (m) => m.CommonResourceModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'group',
        loadChildren: () =>
          import('./permission/permission.module').then(
            (m) => m.PermissionModule
          ),
      },
      {
        path: 'observation',
        loadChildren: () =>
          import('./observation/observation.module').then(
            (m) => m.ObservationModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'route',
        loadChildren: () =>
          import('./route/route.module').then((m) => m.RouteModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'state',
        loadChildren: () =>
          import('./state/state.module').then((m) => m.StateModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'leave',
        loadChildren: () =>
          import('./leave/leave.module').then((m) => m.LeaveModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'meeting-category',
        loadChildren: () =>
          import('./meeting-category/meeting-category.module').then(
            (m) => m.MeetingCategoryModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'submission',
        loadChildren: () =>
          import('./submission/submission.module').then(
            (m) => m.SubmissionModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'work-category',
        loadChildren: () =>
          import('./work-category/work-category.module').then(
            (m) => m.WorkCategoryModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'city',
        loadChildren: () =>
          import('./city/city.module').then((m) => m.CityModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'area',
        loadChildren: () =>
          import('./area/area.module').then((m) => m.AreaModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'point',
        loadChildren: () =>
          import('./point/point.module').then((m) => m.PointModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'course',
        loadChildren: () =>
          import('./course/course.module').then((m) => m.CourseModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'chapter',
        loadChildren: () =>
          import('./chapter/chapter.module').then((m) => m.ChapterModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./department/department.module').then(
            (m) => m.DepartmentModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'MeetingPointCategory',
        loadChildren: () =>
          import('./meeting-point-category/meeting-point-category.module').then(
            (m) => m.MeetingPointCategoryModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'change-password',
        loadChildren: () =>
          import('./change-password/change-password.module').then(
            (m) => m.ChangePasswordModule
          ),
      },
      {
        path: 'staff-room',
        loadChildren: () =>
          import('./staff-room/staff-room.module').then(
            (m) => m.StaffRoomModule
          ),
      },
      {
        path: 'document-setting',
        loadChildren: () =>
          import('./document-setting/document-setting.module').then(
            (m) => m.DocumentSettingModule
          ),
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import('./reporting-cut-off/reporting-cut-off.module').then(
            (m) => m.ReportingCutOffModule
          ),
      },
      {
        path: 'school-group',
        loadChildren: () =>
          import('./school-group-master/school-group-master.module').then(
            (m) => m.SchoolGroupMasterModule
          ),
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import(
            './export-reporting-framework/export-reporting-framework.module'
          ).then((m) => m.ExportReportingFrameworkModule),
      },
      {
        path: 'observation-working-area',
        loadChildren: () =>
          import(
            './observation-working-area/observation-working-area.module'
          ).then((m) => m.ObservationWorkingAreaModule),
      },
      {
        path: 'observation-related-to',
        loadChildren: () =>
          import('./observation-related-to/observation-related-to.module').then(
            (m) => m.ObservationRelatedToModule
          ),
      },
      {
        path: 'ckeditor',
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'custom-field',
        loadChildren: () =>
          import('./custom-field/custom-field.module').then(
            (m) => m.CustomFieldModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'delete-attachment',
        loadChildren: () =>
          import('./delete-attachment/delete-attachment.module').then(
            (m) => m.DeleteAttachmentModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import('./reporting/reporting.module').then((m) => m.ReportingModule),
        canActivate: [schoolAdminGuard],
      },
      // {
      //   path: 'subject-material-type',
      //   loadChildren: () =>
      //     import('./subject-material-type/subject-material-type.module').then(
      //       (m) => m.SubjectMaterialTypeModule
      //     ),
      //   canActivate: [schoolAdminGuard],
      // },
      {
        path: 'medium-and-subject-wise',
        loadChildren: () =>
          import(
            './lo-wise-subject-material/lo-wise-subject-material.module'
          ).then((m) => m.LoWiseSubjectMaterialModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'subject-material-type-category',
        loadChildren: () =>
          import(
            './subject-material-type-category/subject-material-type-category.module'
          ).then((m) => m.SubjectMaterialTypeCategoryModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'leave-setting',
        loadChildren: () =>
          import('./leave-setting/leave-setting.module').then(
            (m) => m.LeaveSettingModule
          ),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'time-slot',
        loadChildren: () =>
          import('./time-slot/time-slot.module').then((m) => m.TimeSlotModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'admission',
        loadChildren: () =>
          import('./admission/admission.module').then((m) => m.AdmissionModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'student',
        loadChildren: () =>
          import('./student/student.module').then((m) => m.StudentModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'razorpay',
        loadChildren: () =>
          import('./razorpay/razorpay.module').then((m) => m.RazorpayModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'fee-category',
        loadChildren: () =>
          import('./fee-category/fee-category.module').then((m) => m.FeeCategoryModule),
        canActivate: [schoolAdminGuard],
      },
      {
        path: 'standard-document',
        component: StandardDocumentComponent,
        canActivate: [schoolAdminGuard],
      },
    ],
  },
  {
    path: ROUTE_PATH.ABSOLUTE,
    redirectTo: REDIRECT_ROUTE_PATH.DASHBOARD,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
