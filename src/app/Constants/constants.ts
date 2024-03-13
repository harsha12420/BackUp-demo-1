export class Constants {
  public static readonly TIME_STAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  public static readonly POST_VIEW_FORMAT = 'DD MMMM';
  static readonly APP_LOGO = '../../../assets/images/klervya-big.png';
  static readonly APP_MINI_LOGO = '../../../assets/images/klervya-small.png';
  static readonly PAGE_LIMIT = 10;
  static readonly STARTING_PAGE = 1;
  static readonly INITLOAD_COMMENT_LIMIT = 3;
  public static readonly TIME_FORMAT = 'HH:mm:ss';
  public static readonly TIME_FORMAT_AM_PM = 'hh:mm A';
  public static readonly TIME_FORMAT_HH_MM = 'HH:mm';
  public static readonly DATE_FORMAT = 'YYYY-MM-DD';
  public static readonly DATE_FORMAT_EVENT = 'DD/MM/YYYY HH:mm:ss';
  public static readonly USER_ROLE = 1;
  public static readonly validEmail =
    '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$';
}

export const USER_ROLE_TYPE = {
  superAdmin: 0,
  organization: 1,
  schoolAdmin: 2,
  staff: 3,
  student: 4,
  parent: 5,
  none: 6,
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  ID: 'id',
  REMEMBER_ME: 'isRememberMe',
  REFRESH_TOKEN: 'refreshToken',
  USER_ROLE: 'userRole',
};

export const REDIRECT_ROUTE_PATH = {
  DASHBOARD: '/admin/dashboard',
};

export const ROUTE_PATH = {
  ABSOLUTE: '',
  USERS: 'user',
  DASHBOARD: 'dashboard',
  AUTH: '/auth',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  VERIFY_EMAIL_ADDRESS: 'verify-email-address',
  RESET_PASSWORD: 'reset-password/:id',
};

export const API_PATH = {
  AUTHENTICATION: {
    LOGIN: 'authentication-service/user/login',
    REGENERATE_TOKEN: 'authentication-service/user/regenerate-token',
    FORGOT_PASS: 'authentication-service/user/forget-password',
    VERIFY_RESET_TOKEN: 'authentication-service/user/verify-reset-token',
    RESET_PASSWORD: 'authentication-service/user/reset-password',
    FCM_TOKEN: 'authentication-service/user/fcm-token',
    LOGOUT: 'authentication-service/user/logout',
    CHANGE_PASSWORD: 'authentication-service/user/change-password',
  },
  USER: {
    ADD_SCHOOL: 'authentication-service/school/add',
    UPDATE_SCHOOL: 'authentication-service/school/update-super-school',
    SCHOOL_LIST: 'authentication-service/school/list',
    SCHOOL_PRESIGN_URL: 'authentication-service/school/presign-url',
    USER_PROFILE: 'authentication-service/user/user/user-profile',
    UPDATE_SCHOOL_PROFILE: 'authentication-service/school/update-school',

    ADD_ORGANIZATION: 'authentication-service/organization/add',
    UPDATE_ORGANIZATION:
      'authentication-service/organization/update-super-organization',
    ORGANIZATION_LIST: 'authentication-service/organization/list',
    ORGANIZATION_PRESIGN_URL: 'authentication-service/organization/presign-url',
    STAFF_PRESIGN_URL: 'authentication-service/school-admin/staff-presign-url',

    ADD_HOLIDAY: 'master-service/holiday',
    HOLIDAY_LIST: 'master-service/holiday/list',
    HOLIDAY_DELETE: 'master-service/holiday/',
    HOLIDAY_LIST_ID: 'master-service/holiday/',
    ADD_TASK: 'master-service/task-category',
    GET_TASK_LIST: 'master-service/task-category/list',
    GET_TASK_ID: 'master-service/task-category/',
    DELETE_TASK: 'master-service/task-category/',
    GROUP_LIST: 'authentication-service/school-admin/group',
    SUB_GROUP: 'authentication-service/school-admin/sub-group',
    ROLE: 'authentication-service/school-admin/role',
    ADD_FOLLOW_UP_category: 'master-service/followupcategory',
    FOLLOW_UP_category_LIST: 'master-service/followupcategory/list',
    FOLLOW_UP_category_DELETE: 'master-service/followupcategory/',
    FOLLOW_UP_categoryLIST_ID: 'master-service/followupcategory/',
    ADD_WORK_STATUS: 'master-service/work-status',
    WORK_STATUS_LIST: 'master-service/work-status/list',
    WORK_STATUS_DELETE: 'master-service/work-status/',
    WORK_STATUS_LIST_ID: 'master-service/work-status/',

    ADD_OBSERVATION_TYPE: 'observation-service/observation-type',
    OBSERVATION_TYPE_LIST: 'observation-service/observation-type/list',
    OBSERVATION_TYPE_DELETE: 'observation-service/observation-type/',
    OBSERVATION_TYPE_LIST_ID: 'observation-service/observation-type/',

    ADD_JOB_ROUND: 'master-service/job-round',
    JOB_ROUND_LIST: 'master-service/job-round/list',
    JOB_ROUND_DELETE: 'master-service/job-round/',
    JOB_ROUND_LIST_ID: 'master-service/job-round/',

    ADD_MEDIUM: 'master-service/medium',
    MEDIUM_LIST: 'master-service/medium/list',
    MEDIUM_DELETE: 'master-service/medium/',
    MEDIUM_LIST_ID: 'master-service/medium/',
    MEDIUM_LIST_DETAILS_ID: 'master-service/medium/medium-detail/',

    ADD_DIVISION: 'master-service/division',
    DIVISION_LIST: 'master-service/division/list',
    DIVISION_DELETE: 'master-service/division/',
    DIVISION_LIST_ID: 'master-service/division/',
    STANDARD_WISE_DIVISION: 'master-service/division/standard-list/',

    ADD_LEAVE_RECORD: 'student-parent-service/reason-for-leaving',
    GET_LEAVE_RECORD: 'student-parent-service/reason-for-leaving/list',
    DELETE_LEAVE_RECORD: 'student-parent-service/reason-for-leaving/',

    ADD_HEAD_GROUP_MASTER: 'fee-service/fee-head-group-master',
    GET_HEAD_GROUP_MASTER: 'fee-service/fee-head-group-master',
    GET_HEAD_GROUP_MASTER_BY_ID: 'fee-service/fee-head-group-master/',
    DELETE_HEAD_GROUP_MASTER: 'fee-service/fee-head-group-master/',

    ADD_GROUP_MASTER: 'fee-service/fee-group-master',
    GET_GROUP_MASTER: 'fee-service/fee-group-master',
    GET_GROUP_MASTER_BY_ID: 'fee-service/fee-group-master/',
    DELETE_GROUP_MASTER: 'fee-service/fee-group-master/',

    ADD_HEAD_AND_GROUP_MAPPING_MASTER: 'fee-service/fee-head-and-group-mapping',
    GET_HEAD_AND_GROUP_MAPPING_MASTER: 'fee-service/fee-head-and-group-mapping',
    GET_HEAD_AND_GROUP_MAPPING_MASTER_BY_ID:
      'fee-service/fee-head-and-group-mapping/',
    DELETE_HEAD_AND_GROUP_MAPPING_MASTER:
      'fee-service/fee-head-and-group-mapping/',

    ADD_STD_WISE_CATEGORY_WISE_MAPPING:
      'fee-service/std-wise-category-wise-fee-mapping-master',
    GET_STD_WISE_CATEGORY_WISE_MAPPING_LIST:
      'fee-service/std-wise-category-wise-fee-mapping-master',
    GET_STD_WISE_CATEGORY_WISE_MAPPING_BY_ID:
      'fee-service/std-wise-category-wise-fee-mapping-master/',
    DELETE_STD_WISE_CATEGORY_WISE_MAPPING:
      'fee-service/std-wise-category-wise-fee-mapping-master/',

    ADD_DESIGNATION: 'master-service/designation',
    DESIGNATION_LIST: 'master-service/designation/list',
    DESIGNATION_DELETE: 'master-service/designation/',
    DESIGNATION_LIST_ID: 'master-service/designation/',

    ADD_STANDARD: 'master-service/standard',
    STANDARD_LIST: 'master-service/standard/list',
    STANDARD_DELETE: 'master-service/standard/',
    STANDARD_LIST_ID: 'master-service/standard/',
    STANDARD_LIST_BY_ID: 'master-service/standard/standard-list/',

    ADD_EXAM: 'master-service/exam',
    EXAM_LIST: 'master-service/exam/list',
    EXAM_DELETE: 'master-service/exam/',
    EXAM_LIST_ID: 'master-service/exam/',

    ADD_SUBJECT: 'master-service/subject',
    SUBJECT_LIST: 'master-service/subject/list',
    SUBJECT_DELETE: 'master-service/subject/',
    SUBJECT_LIST_ID: 'master-service/subject/',
    SUBJECT_LIST_BY_ID: 'master-service/subject/subject-list/',
    SUBJECT_LIST_SEQUENCE: 'master-service/subject/sequence',

    ADD_SUBJECT_CATEGORY: 'master-service/subject-category',
    SUBJECT_CATEGORY_LIST: 'master-service/subject-category/list',
    SUBJECT_CATEGORY_DELETE: 'master-service/subject-category/',
    SUBJECT_CATEGORY_LIST_BY_ID: 'master-service/subject/subject-list/',

    ADD_MEDIUM_SUBJECT_PRIORITY: 'master-service/medium-subject',
    SUBJECT_PRIORITY_LIST: 'master-service/medium-subject/list',
    SUBJECT_PRIORITY_DELETE: 'master-service/medium-subject/',
    SUBJECT_PRIORITY_SEQUENCE: 'master-service/medium-subject/sequence',

    ADD_MEDIUM_STANDARD_SUBJECT_ASSIGNMENT: 'master-service/medium-standard',
    MEDIUM_STANDARD_SUBJECT_ASSIGNMENT_LIST:
      'master-service/medium-standard/list',
    MEDIUM_STANDARD_SUBJECT_ASSIGNMENT_DELETE:
      'master-service/medium-standard/',

    STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT_LIST:
      'subject-planning-service/student-wise-subject/list',
    ADD_STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT:
      'subject-planning-service/student-wise-subject',
    STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT_DELETE:
      'subject-planning-service/student-wise-subject/',

    SUBJECT_WISE_LESSON_PLANNING_LIST:
      'subject-planning-service/lesson-planning/list',
    SUBJECT_WISE_LESSON_PLANNING_LIST_SEQUENCE:
      'subject-planning-service/lesson-planning/sequence',
    ADD_SUBJECT_WISE_LESSON_PLANNING:
      'subject-planning-service/lesson-planning',
    SUBJECT_WISE_LESSON_PLANNING_DELETE:
      'subject-planning-service/lesson-planning/',

    LESSON_WISE_TOPIC_SUBTOPIC_LIST: 'subject-planning-service/topics/list',
    ADD_LESSON_WISE_TOPIC_SUBTOPIC: 'subject-planning-service/topics',
    LESSON_WISE_TOPIC_DELETE: 'subject-planning-service/topics/topic/',
    LESSON_WISE_SUBTOPIC_DELETE: 'subject-planning-service/topics/sub-topic/',
    EDIT_LESSON_WISE_SUBTOPIC: 'subject-planning-service/topics/edit-sub-topic',
    EDIT_LESSON_WISE_TOPIC: 'subject-planning-service/topics/edit-topic',
    ADD_TPOIC_WISE_SUBTOPIC: 'subject-planning-service/topics/add-sub-topic',
    LESSON_WISE_TOPIC_LIST: 'subject-planning-service/topics/topic-list',

    ADD_LO_LEVEL: 'master-service/lo-level',
    LO_LEVEL_LIST: 'master-service/lo-level/list',
    LO_LEVEL_LIST_ID: 'master-service/lo-level/',
    LO_LEVEL_DELETE: 'master-service/lo-level/',
    LO_LEVEL_SEQUENCE: 'master-service/lo-level/sequence',

    ADD_TOPIC_WISE_LO: 'subject-planning-service/topic-wise-lo-entry',
    TOPIC_WISE_LO_LIST: 'subject-planning-service/topic-wise-lo-entry/list',
    TOPIC_WISE_LO_DELETE: 'subject-planning-service/topic-wise-lo-entry/',

    ADD_QUESTION_TYPE_MASTER: 'master-service/question-type',
    QUESTION_TYPE_MASTER_LIST: 'master-service/question-type/list',
    QUESTION_TYPE_MASTER_BY_ID_LIST: 'master-service/question-type',
    QUESTION_TYPE_MASTER_DELETE: 'master-service/question-type/',

    ADD_QUESTION_TYPE_DIFFICULTY_LEVEL_MASTER:
      'master-service/difficulty-level',
    QUESTION_TYPE_DIFFICULTY_LEVEL_LIST: 'master-service/difficulty-level/list',
    QUESTION_TYPE_DIFFICULTY_LEVEL_BY_ID_LIST:
      'master-service/difficulty-level',
    QUESTION_TYPE_DIFFICULTY_LEVEL_DELETE: 'master-service/difficulty-level/',

    ADD_QUESTION: 'master-service/questions',
    QUESTIONS_LIST: 'master-service/questions/list',
    QUESTION_DELETE: 'master-service/questions/',

    ADD_CLASS: 'master-service/class-management',
    CLASS_LIST: 'master-service/class-management/list',
    CLASS_DELETE: 'master-service/class-management/',
    CLASS_LIST_ID: 'master-service/class-management/',

    ADD_COMMON_RESOURCE: 'master-service/common-resource',
    COMMON_RESOURCE_LIST: 'master-service/common-resource/list',
    COMMON_RESOURCE_DELETE: 'master-service/common-resource/',
    COMMON_RESOURCE_LIST_ID: 'master-service/common-resource/',
    // route

    ADD_OBSERVATION: 'observation-service/observation-memo',
    OBSERVATION_LIST: 'observation-service/observation-memo/list',
    OBSERVATION_DELETE: 'observation-service/observation-memo/',
    OBSERVATION_LIST_ID: 'observation-service/observation-memo/',

    ADD_ROUTE: 'master-service/route',
    ROUTE_LIST: 'master-service/route/list',
    ROUTE_DELETE: 'master-service/route/',
    ROUTE_LIST_ID: 'master-service/route/',

    ADD_STATE: 'master-service/state',
    STATE_LIST: 'master-service/state/list',
    STATE_DELETE: 'master-service/state/',
    STATE_LIST_ID: 'master-service/state/',
    STATE_LIST_MASTER: 'master-service/state-district-vilage-pincode/state',

    //DISTRICT
    DISTRICT_LIST_MASTER:
      'master-service/state-district-vilage-pincode/district',
    SUB_DISTRICT_LIST_MASTER:
      'master-service/state-district-vilage-pincode/sub-district',

    //VILLAGE
    VILLAGE_LIST_MASTER: 'master-service/state-district-vilage-pincode/village',
    PInCODE_LIST_MASTER: 'master-service/state-district-vilage-pincode/pincode',

    //Leave
    ADD_LEAVE_TYPE: 'master-service/leave-type',
    LEAVE_TYPE_LIST: 'master-service/leave-type/list',
    LEAVE_TYPE_DELETE: 'master-service/leave-type/',
    LEAVE_TYPE_LIST_ID: 'master-service/leave-type/',

    // Meeting category
    ADD_MEETING_CATEGORY: 'master-service/meeting-category',
    MEETING_CATEGORY_LIST: 'master-service/meeting-category/list',
    MEETING_CATEGORY_DELETE: 'master-service/meeting-category/',
    MEETING_CATEGORY_LIST_ID: 'master-service/meeting-category/',

    //Work Category
    ADD_WORK_CATEGORY: 'master-service/work-category',
    WORK_CATEGORY_LIST: 'master-service/work-category/list',
    WORK_CATEGORY_DELETE: 'master-service/work-category/',
    WORK_CATEGORY_LIST_ID: 'master-service/work-category/',

    //submission
    ADD_SUBMISSION: 'master-service/submission',
    SUBMISSION_LIST: 'master-service/submission/list',
    SUBMISSION_DELETE: 'master-service/submission/',
    SUBMISSION_LIST_ID: 'master-service/submission/',

    MENU_LIST: 'authentication-service/menu',
    MENU_BY_ROLE_ID: 'authentication-service/menu/user-role-menu',
    ADD_MENU_BY_ROLE: 'authentication-service/menu/role-menu',
    ADD_CITY: 'master-service/city',
    CITY_LIST: 'master-service/city/list',
    CITY_LIST_BY_ID: 'master-service/city/city-list',
    CITY_DELETE: 'master-service/city/',
    CITY_LIST_ID: 'master-service/city/',

    ADD_AREA: 'master-service/area',
    AREA_LIST: 'master-service/area/list',
    AREA_DELETE: 'master-service/area/',
    AREA_LIST_ID: 'master-service/area/',
    AREA_LIST_BY_ID: 'master-service/area/area-list/',

    ADD_POINT: 'master-service/point',
    PONIT_LIST: 'master-service/point/list',
    PONIT_DELETE: 'master-service/point/',
    PONIT_LIST_ID: 'master-service/point/',

    //course
    ADD_COURSE: 'master-service/course',
    COURSE_LIST: 'master-service/course/list',
    COURSE_DELETE: 'master-service/course/',
    COURSE_LIST_ID: 'master-service/course/',
    //Chapter
    ADD_CHAPTER: 'master-service/chapter',
    CHAPTER_LIST: 'master-service/chapter/list',
    CHAPTER_DELETE: 'master-service/chapter/',
    CHAPTER_LIST_ID: 'master-service/chapter/',

    //LeaveSeting
    GET_LEAVE_SETING: 'master-service/leave-setting',
    PUT_LEAVE_SETING: 'master-service/leave-setting',
    //department
    ADD_DEPARTMENT: 'master-service/department',
    DEPARTMENT_LIST: 'master-service/department/list',
    DEPARTMENT_DELETE: 'master-service/department/',
    DEPARTMENT_LIST_ID: 'master-service/department/',

    // Staff
    ADD_STAFF: 'authentication-service/school-admin/user-role',
    GET_STAFF: 'authentication-service/school-admin/user-staff',

    //Meeting point category
    ADD_MEETING_POINT_CATEGORY: 'master-service/meeting-point-category',
    MEETING_POINT_CATEGORY_LIST: 'master-service/meeting-point-category/list',
    MEETING_POINT_CATEGORY_DELETE: 'master-service/meeting-point-category/',
    MEETING_POINT_CATEGORY_LIST_ID: 'master-service/meeting-point-category/',
    //Staff Room
    ADD_STAFF_ROOM: 'master-service/staff-room',
    STAFF_ROOM_LIST: 'master-service/staff-room/list',
    STAFF_ROOM_DELETE: 'master-service/staff-room/',
    STAFF_ROOM_LIST_ID: 'master-service/staff-room/',

    // Document Setting
    DOCUMENT_SETTING: 'master-service/document-setting',
    DOCUMENT_SETTING_LIST: 'master-service/document-setting/list',
    DOCUMENT_SETTING_DELETE: 'master-service/document-setting/',
    DOCUMENT_SETTING_LIST_ID: 'master-service/document-setting/',

    //Edit Super Admin
    EDIT_SUPER_ADMIN_PROFILE: 'authentication-service/user/update-superadmin',
    //edit Organization
    EDIT_ORGANIZATION_PROFILE:
      'authentication-service/organization/update-organization',
    // school-admin/staff-verify-email
    VERIFY_EMAIL_STAFF_ADD:
      'authentication-service/school-admin/staff-verify-email',

    //Reporting CutOff
    ADD_REPORTING_CUT_OFF: 'reporting-service/reporting-cutoff',
    LIST_REPORTING_CUT_OFF: 'reporting-service/reporting-cutoff/list',
    DELETE_REPORTING_CUT_OFF: 'reporting-service/reporting-cutoff/',

    //School Group Master
    ADD_SCHOOL_GROUP: 'master-service/school-group-master',
    LIST_SCHOOL_GROUP: 'master-service/school-group-master/list',
    DELETE_SCHOOL_GROUP: 'master-service/school-group-master/',
    //Reporting Framework
    ADD_RESPORTING_FRAMEWORK: 'reporting-service/reporting-framework',
    LIST_RESPORTING_FRAMEWORK: 'reporting-service/reporting-framework/list',
    DELETE_RESPORTING_FRAMEWORK: 'reporting-service/reporting-framework/',
    //Observation: Sub working area
    ADD_OBSERVATION_WORKING_AREA: 'observation-service/subworking-area',
    LIST_OBSERVATION_WORKING_AREA: 'observation-service/subworking-area/list',
    DELETE_OBSERVATION_WORKING_AREA: 'observation-service/subworking-area/',

    //Observation Related To

    ADD_OBSERVATION_RELATED_TO: 'observation-service/observation-related-to',
    LIST_OBSERVATION_RELATED_TO:
      'observation-service/observation-related-to/list',
    DELETE_OBSERVATION_RELATED_TO:
      'observation-service/observation-related-to/',

    // Students
    STUDENT_LIST: 'authentication-service/school-admin/get-students',

    //Custom Field
    CUSTOM_FIELD: 'customfield-service/custom-field',
    INPUT_FIELD: 'customfield-service/input-field',
    FORM_LIST: 'customfield-service/form-list',
    STEP_LIST: 'customfield-service/step-list',
    FORM_GROUP_LIST: 'customfield-service/group-list',
    CHNAGE_STATUS: 'customfield-service/custom-field/changeStatus',
    REFRENCE_LIST: 'customfield-service/reference-list',
    SAVE_GET_FROM_FIELD: 'customfield-service/form',
    SELECTED_FIELDS: 'customfield-service/form/getFields',
    SAVE_CF_FORM_VALUES: 'customfield-service/form-value',
    CUSTOM_FIELD_PRESIGNED_URL: 'customfield-service/form-value/presign-url',
    CUSTOM_FORM_FIELDS: 'customfield-service/form/getDataBySequence',
    CUSTOM_FIELD_SEQUENCE: 'customfield-service/form/changeSequence',
    CUSTOM_FIELD_STEP_SEQUENCE: 'customfield-service/step-list/changeSequence',

    // Delete Attachment
    DELETE_ATTACHMENT: 'authentication-service/delete-attachment',

    // Reporting
    STATISTICS_REPORTING: 'reporting-service/reporting/statistics-list',
    ALL_REPORTING: 'reporting-service/reporting/all-reporting',
    GET_ALL_STAFF: 'reporting-service/reporting/all-staff',

    // Subject Material Type
    ADD_SUBJECT_MATERIAL_TYPE:
      'master-service/lo-wise-subject-material-entry/create-subject-material-type',
    UPDATE_SUBJECT_MATERIAL_TYPE:
      'master-service/lo-wise-subject-material-entry/update-subject-material-type/',
    GET_SUBJECT_MATERIAL_TYPE:
      'master-service/lo-wise-subject-material-entry/list-subject-material-type',
    GET_BY_ID_SUBJECT_MATERIAL_TYPE:
      'master-service/lo-wise-subject-material-entry/subject-material-type/',
    DELETE_SUBJECT_MATERIAL_TYPE:
      'master-service/lo-wise-subject-material-entry/subject-material-type/',

    //Materials
    ADD_MATERIALS: 'subject-planning-service/materials',
    LIST_MATERIALS: 'subject-planning-service/materials/list',
    GET_BY_ID_MATERIALS: 'subject-planning-service/materials/',
    DELETE_MATERIALS: 'subject-planning-service/materials/',

    // Subject Material Type Category
    UPDATE_SUBJECT_MATERIAL_TYPE_CATEGORY:
      'master-service/lo-wise-subject-material-entry/subject-material-type-category',
    GET_SUBJECT_MATERIAL_TYPE_CATEGORY:
      'master-service/lo-wise-subject-material-entry/list-subject-material-type-category',
    GET_BY_ID_SUBJECT_MATERIAL_TYPE_CATEGORY:
      'master-service/lo-wise-subject-material-entry/subject-material-type-category/',
    DELETE_SUBJECT_MATERIAL_TYPE_CATEGORY:
      'master-service/lo-wise-subject-material-entry/delete-subject-material-type-category/',

    // Session
    UPDATE_SESSION: 'admission-service/session',
    GET_SESSION: 'admission-service/session',
    DELETE_SESSION: 'admission-service/session/',

    // Academic Year
    UPDATE_ACADEMIC_YEAR: 'admission-service/academic-year',
    GET_ACADEMIC_YEAR: 'admission-service/academic-year',
    DELETE_ACADEMIC_YEAR: 'admission-service/academic-year/',

    // Academic Year Validation
    UPDATE_ACADEMIC_YEAR_VALIDATION:
      'admission-service/academic-year-validation',
    GET_ACADEMIC_YEAR_VALIDATION: 'admission-service/academic-year-validation',
    DELETE_ACADEMIC_YEAR_VALIDATION:
      'admission-service/academic-year-validation/',

    // Source Of Information
    UPDATE_SOURCE_OF_INFORMATION: 'admission-service/source-of-information',
    GET_SOURCE_OF_INFORMATION: 'admission-service/source-of-information',
    DELETE_SOURCE_OF_INFORMATION: 'admission-service/source-of-information/',
    //State-District-Vilage-Pincode

    UPADTE_MASTER_STATE: 'master-service/state-district-vilage-pincode/state',
    GET_MASTER_STATE: 'master-service/state-district-vilage-pincode/state',
    DELETE_MASTER_STATE: 'master-service/state-district-vilage-pincode/state/',

    UPADTE_MASTER_DISTRICT:
      'master-service/state-district-vilage-pincode/district',
    GET_MASTER_DISTRICT:
      'master-service/state-district-vilage-pincode/district',
    DELETE_MASTER_DISTRICT:
      'master-service/state-district-vilage-pincode/district/',

    UPADTE_MASTER_SUB_DISTRICT:
      'master-service/state-district-vilage-pincode/sub-district',
    GET_MASTER_SUB_DISTRICT:
      'master-service/state-district-vilage-pincode/sub-district',
    DELETE_MASTER_SUB_DISTRICT:
      'master-service/state-district-vilage-pincode/sub-district/',
    UPADTE_MASTER_VILLAGE:
      'master-service/state-district-vilage-pincode/village',
    GET_MASTER_VILLAGE: 'master-service/state-district-vilage-pincode/village',
    DELETE_MASTER_VILLAGE:
      'master-service/state-district-vilage-pincode/village/',
    UPADTE_MASTER_PINCODE:
      'master-service/state-district-vilage-pincode/pincode',
    GET_MASTER_PINCODE: 'master-service/state-district-vilage-pincode/pincode',
    DELETE_MASTER_PINCODE:
      'master-service/state-district-vilage-pincode/pincode/',

    //Time Slot

    GET_TIME_SLOT: 'admission-service/time-slot-master/list',
    UPDATE_TIME_SLOT: 'admission-service/time-slot-master',
    DELETE_TIME_SLOT: 'admission-service/time-slot-master/',
    GET_BY_ID_LC_APPROCAL_FEES_RECORD:
      'student-parent-service/lc-approval-fee-record/',
    UPDATE_LC_APPROCAL_FEES_RECORD:
      'student-parent-service/lc-approval-fee-record/',
    GET_LIST_LC_APPROCAL_FEES_RECORD:
      'student-parent-service/lc-approval-fee-record/list',
    LEAVE_CERTIFICATE_LIST: 'student-parent-service/lc-application/list',

    GET_FEE_CATEGORY_LIST: 'admission-service/feeCategory',
    //Generate Lc
    POST_GENERATE_LC: 'student-parent-service/generate-lc',
    GET_GENERATE_LC: 'student-parent-service/generate-lc/list',
    //Razorpay
    REFUND_PAYMENT: 'authentication-service/payment/refund',

    //Fee category master
    FEE_CATEGORY: 'admission-service/feeCategory',

    //Assign Document Master
    ASSIGN_DOCUMENT_MASTER: 'admission-service/documentStandard',
    //Division Transfer
    GET_DIVISION_STUDDENT_LIST: 'student-parent-service/division-transfer',
    UPDATE_DIVISION_TRANSFER: 'student-parent-service/division-transfer',
    GET_BY_ID_DIVISION_TRANSFER: 'student-parent-service/division-transfer/',
    GET_TRANSFER_STUDENT:
      'student-parent-service/division-transfer/transfer-list',

    //Roll No
    ROLL_NO: 'student-parent-service/roll-number',
    ROLL_NO_POST: 'student-parent-service/roll-number',
    // Freeze
    FREEZE_ROLL_NO: 'student-parent-service/roll-number/freeze',
    FREEZE_ROLL_NO_PATCH: 'student-parent-service/roll-number/freezeUpdate',
  },
};
export const ERROR = {
  IMAGE_ERROR: 'Please Select Proper Image',
};

export const InputFieldType = {
  Number: 'number',
  Text: 'text',
  TextArea: 'textarea',
  Dropdown: 'dropdown',
  Checkbox: 'checkbox',
  Radio: 'radio',
  Email: 'email',
  Password: 'password',
  Datepicker: 'datepicker',
  Datetime: 'datetime',
  Timepicker: 'timepicker',
  Reference: 'reference',
  File: 'file',
  Editor: 'editor',
};

export const CUSTOM_FIELD_FORM_TYPES = [
  {
    id: 1,
    name: 'Admission Form',
  },
  {
    id: 2,
    name: 'Enquiry Form',
  },
  {
    id: 3,
    name: 'Student Profile Form',
  },
  {
    id: 4,
    name: 'Staff Profile Form',
  },
];

export const CUSTOM_FIELD_STEPS = [
  {
    id: 1,
    name: 'Personal Details',
  },
  {
    id: 2,
    name: 'Official Details',
  },
  {
    id: 3,
    name: 'Student Details',
  },
  {
    id: 4,
    name: 'Contact Details',
  },
  {
    id: 5,
    name: 'ICE Details',
  },
  {
    id: 6,
    name: 'Students Aadhar & Bank Details',
  },
  {
    id: 7,
    name: 'Previous School Details',
  },
  {
    id: 8,
    name: 'Details Of Parents/Guardian',
  },
  {
    id: 9,
    name: 'Other Details',
  },
  {
    id: 10,
    name: 'Family Details',
  },
];

export const CUSTOM_FIELD_STEPS_COUNT = [
  {
    id: 1,
    name: 'Step 1',
  },
  {
    id: 2,
    name: 'Step 2',
  },
  {
    id: 3,
    name: 'Step 3',
  },
  {
    id: 4,
    name: 'Step 4',
  },
  {
    id: 5,
    name: 'Step 5',
  },
  {
    id: 6,
    name: 'Step 6',
  },
  {
    id: 7,
    name: 'Step 7',
  },
  {
    id: 8,
    name: 'Step 8',
  },
  {
    id: 9,
    name: 'Step 9',
  },
  {
    id: 10,
    name: 'Step 10',
  },
];

export const DefaultMedium = 'English';
