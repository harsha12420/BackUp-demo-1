import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { USER_ROLE_TYPE } from 'src/app/Constants/constants';

// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  role?: number[];
  pop?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      headTitle: 'MAIN',
    },
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      type: 'link',
      active: false,
      role: [
        USER_ROLE_TYPE.superAdmin,
        USER_ROLE_TYPE.organization,
        USER_ROLE_TYPE.schoolAdmin,
      ],
      path: '/admin/dashboard',
    },
    {
      title: 'School',
      icon: 'fas fa-school',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.organization],
      path: '/admin/school',
    },
    {
      title: 'Organization',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/organization',
    },
    {
      title: 'State',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/states',
    },
    {
      title: 'District',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/district',
    },
    {
      title: 'Sub District',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/sub-district',
    },
    {
      title: 'Vilage',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/vilage',
    },
    {
      title: 'Pincode',
      icon: 'fas fa-building',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.superAdmin],
      path: '/admin/pincode',
    },
    //
    {
      title: 'Staff',
      icon: 'fas fa-user-tie',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      path: '/admin/staff',
    },
    {
      title: 'Roles and Permission',
      icon: 'fas fa-lock',
      type: 'sub',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      children: [
        { path: '/admin/group/sub-group', title: 'Sub Group', type: 'link' },
        { path: '/admin/group/role', title: 'Role', type: 'link' },
        { path: '/admin/group/permission', title: 'Permission', type: 'link' },
      ],
    },
    {
      title: 'Master Data',
      icon: 'fas fa-database',
      type: 'sub',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      children: [
        { path: '/admin/department', title: ' Department', type: 'link' },
        { path: '/admin/holiday', title: ' Holiday', type: 'link' },
        { path: '/admin/task', title: ' Task Category', type: 'link' },
        {
          path: '/admin/follow-up',
          title: ' Follow Up Category',
          type: 'link',
        },
        { path: '/admin/work-status', title: ' Work Status', type: 'link' },
        {
          path: '/admin/observation',
          title: ' Observation Memo',
          type: 'link',
        },
        {
          path: '/admin/observation-type',
          title: ' Observation Type',
          type: 'link',
        },
        {
          path: '/admin/observation-working-area',
          title: ' Observation Working Area',
          type: 'link',
        },
        {
          path: '/admin/observation-related-to',
          title: ' Observation Related To',
          type: 'link',
        },

        {
          path: '/admin/job-round',
          title: ' Job Round',
          type: 'link',
        },
        {
          path: '/admin/medium',
          title: ' Medium',
          type: 'link',
        },
        {
          path: '/admin/division',
          title: ' Division',
          type: 'link',
        },
        {
          path: '/admin/designtion',
          title: ' Designtion',
          type: 'link',
        },
        {
          path: '/admin/standard',
          title: ' Standard',
          type: 'link',
        },
        {
          path: '/admin/exam',
          title: ' Exam',
          type: 'link',
        },
        {
          path: '/admin/subject',
          title: ' Subject',
          type: 'link',
        },
        {
          path: '/admin/subject-category',
          title: ' Subject Category',
          type: 'link',
        },
        {
          path: '/admin/medium-wise-subject-priority',
          title: ' Medium Wise Subject Priority',
          type: 'link',
        },
        {
          path: '/admin/medium-standard-wise-subject-assignment',
          title: 'Medium & Standard Wise Subject Assignment',
          type: 'link',
        },
        {
          path: '/admin/student-wise-optional-subject-assignment',
          title: 'Student Wise Optional Subject Assignment',
          type: 'link',
        },
        {
          path: '/admin/subject-wise-lesson-planning',
          title: 'Subject Wise Lesson Planning',
          type: 'link',
        },
        // {
        //   path: '/admin/subject-material-type',
        //   title: 'Subject Material Type',
        //   type: 'link',
        // },
        {
          path: '/admin/subject-material-type-category',
          title: 'Subject Material Type Category',
          type: 'link',
        },
        // {
        //   path: '/admin/lesson-wise-topic-subtopic-entry',
        //   title: 'Lesson Wise Topic And Subtopic Entry',
        //   type: 'link',
        // },
        {
          path: '/admin/lo-level',
          title: 'Lo Level',
          type: 'link',
        },
        // {
        //   path: '/admin/topic-wise-lo',
        //   title: 'Topic wise Lo',
        //   type: 'link',
        // },
        {
          path: '/admin/question-type-master',
          title: 'Question Type Master',
          type: 'link',
        },
        {
          path: '/admin/question-difficulty-level-master',
          title: 'Question Type Difficulty Level',
          type: 'link',
        },
        // {
        //   path: '/admin/lo-wise-questions',
        //   title: ' LO Wise Questions',
        //   type: 'link',
        // },
        {
          path: '/admin/class',
          title: ' Class',
          type: 'link',
        },
        {
          path: '/admin/common-resource',
          title: ' Common Resource',
          type: 'link',
        },

        {
          path: '/admin/route',
          title: ' Route',
          type: 'link',
        },
        {
          path: '/admin/state',
          title: ' State',
          type: 'link',
        },
        {
          path: '/admin/leave',
          title: '  leave',
          type: 'link',
        },
        {
          path: '/admin/meeting-category',
          title: '  Meeting Category',
          type: 'link',
        },
        {
          path: '/admin/work-category',
          title: '  Work Category',
          type: 'link',
        },
        {
          path: '/admin/submission',
          title: '  Submission',
          type: 'link',
        },
        {
          path: '/admin/city',
          title: '  City',
          type: 'link',
        },
        {
          path: '/admin/area',
          title: '  Area',
          type: 'link',
        },
        {
          path: '/admin/point',
          title: '  Point',
          type: 'link',
        },
        {
          path: '/admin/course',
          title: '  Course',
          type: 'link',
        },
        {
          path: '/admin/chapter',
          title: '  Chapter',
          type: 'link',
        },
        {
          path: '/admin/leave-setting',
          title: 'Leave Setting',
          type: 'link',
        },
        {
          path: '/admin/MeetingPointCategory',
          title: '  Meeting Point Category',
          type: 'link',
        },
        {
          path: '/admin/staff-room',
          title: '  Staff Room',
          type: 'link',
        },
        {
          path: '/admin/document-setting',
          title: '  Document Setting',
          type: 'link',
        },
        {
          path: '/admin/time-slot',
          title: '  Time Slot',
          type: 'link',
        },
        // {
        //   path: '/admin/medium-and-subject-wise',
        //   title: ' Subject Material Entry',
        //   type: 'link',
        // },
        {
          path: '/admin/school-group',
          title: 'School Group',
          type: 'link',
        },
        {
          path: '/admin/admission/session',
          title: 'Session',
          type: 'link',
        },
        {
          path: '/admin/admission/academic-year',
          title: 'Academic Year',
          type: 'link',
        },
        {
          path: '/admin/admission/academic-year-validation',
          title: 'Academic Year Validation',
          type: 'link',
        },
        {
          path: '/admin/admission/source-of-information',
          title: 'Source Of Information',
          type: 'link',
        },
        {
          path: '/admin/student-leave-from-master',
          title: 'Reason Of Leave',
          type: 'link',
        },
        {
          path: '/admin/fee-category',
          title: 'Fee Category',
          type: 'link',
        },
        {
          path: '/admin/fees/fee-head-group-master',
          title: 'Fee Head Group',
          type: 'link',
        },
        {
          path: '/admin/fees/fee-group-master',
          title: 'Fee Group',
          type: 'link',
        },
        {
          path: '/admin/fees/fee-head-and-group-mapping',
          title: 'Fee Head And Group Mapping',
          type: 'link',
        },
        {
          path: '/admin/fees/std-category-wise-mapping',
          title: 'Standard Category Wise Fee Mapping',
          type: 'link',
        },
        {
          path: '/admin/standard-document',
          title: 'Assign Document To Standard',
          type: 'link',
        },
      ],
    },
    {
      title: 'Reporting',
      icon: 'fas fa-chart-line',
      type: 'sub',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      children: [
        {
          path: '/admin/reporting/cut-off',
          title: 'Reporting Cut Off',
          type: 'link',
        },
        {
          path: '/admin/reporting/framework',
          title: 'Reporting Framework',
          type: 'link',
        },
        {
          path: '/admin/reporting/all-reporting',
          title: 'All Reporting',
          type: 'link',
        },
        {
          path: '/admin/reporting/reporting-statistics',
          title: 'Reporting Statistics',
          type: 'link',
        },
      ],
    },
    {
      title: 'Ck Editor demo',
      icon: 'fas fa-pencil-alt',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      path: '/admin/ckeditor',
    },
    {
      title: 'Custom Field',
      icon: 'fa fa-bars',
      type: 'sub',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      children: [
        {
          path: '/admin/custom-field/add',
          title: 'Custom Field',
          type: 'link',
        },
        {
          path: '/admin/custom-field/list',
          title: 'Custom Field List',
          type: 'link',
        },
        {
          path: '/admin/custom-field/steps',
          title: 'View Step',
          type: 'link',
        },
        {
          path: '/admin/custom-field/groups',
          title: 'View Group',
          type: 'link',
        },
        {
          path: '/admin/custom-field/select',
          title: 'Field Selection',
          type: 'link',
        },
        {
          path: '/admin/custom-field/generate-form',
          title: 'Generate Form',
          type: 'link',
        },
        {
          path: '/admin/custom-field/form-fields',
          title: 'Form Field List',
          type: 'link',
        },
      ],
    },
    {
      title: 'Delete Attachment',
      icon: 'fas fa-trash-alt',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      path: '/admin/delete-attachment',
    },
    {
      title: 'Student',
      icon: 'fas fa-user-graduate',
      type: 'sub',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      children: [
        {
          path: '/admin/student/lc_approval_with_fees_record',
          title: 'Lc Approval With Fees Record ',
          type: 'link',
        },
        {
          path: '/admin/student/generate_lc',
          title: 'Generate Lc ',
          type: 'link',
        },
        {
          path: '/admin/student/division-transfer',
          title: 'Division Transfer ',
          type: 'link',
        },
        {
          path: '/admin/student/roll_no',
          title: 'Roll Number Generation',
          type: 'link',
        },
        {
          path: '/admin/student/roll_no_update',
          title: 'Update Roll Number',
          type: 'link',
        },
        {
          path: '/admin/student/roll_no_freeze',
          title: 'Roll Number Freeze Functionality',
          type: 'link',
        },
      ],
    },
    {
      title: 'Razorpay demo',
      icon: 'fa fa-money',
      type: 'link',
      active: false,
      role: [USER_ROLE_TYPE.schoolAdmin],
      path: '/admin/razorpay',
    },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
