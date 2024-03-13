import { Injectable } from '@angular/core';
import { HttpRequestsService } from './http-requests.service';
import { API_PATH } from '../Constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpRequestsService) {}
  userProfile = async () => {
    return this.http.get(API_PATH.USER.USER_PROFILE);
  };

  addSchool = async (data) => {
    return this.http.post(API_PATH.USER.ADD_SCHOOL, data);
  };

  updateSchool = async (data) => {
    return this.http.put(API_PATH.USER.UPDATE_SCHOOL, data);
  };

  updateSchoolProfile = async (data) => {
    return this.http.put(API_PATH.USER.UPDATE_SCHOOL_PROFILE, data);
  };

  schoolPresignedUrl = async (data) => {
    return this.http.post(API_PATH.USER.SCHOOL_PRESIGN_URL, data);
  };

  getSchoolList = async (queryList) => {
    return this.http.get(API_PATH.USER.SCHOOL_LIST + queryList);
  };

  addOrganization = async (data) => {
    return this.http.post(API_PATH.USER.ADD_ORGANIZATION, data);
  };

  updateOrganization = async (data) => {
    return this.http.put(API_PATH.USER.UPDATE_ORGANIZATION, data);
  };

  organizationPresignedUrl = async (data) => {
    return this.http.post(API_PATH.USER.ORGANIZATION_PRESIGN_URL, data);
  };

  staffPresignedUrl = async (data) => {
    return this.http.post(API_PATH.USER.STAFF_PRESIGN_URL, data);
  };

  getOrganizationList = async (queryList) => {
    return this.http.get(API_PATH.USER.ORGANIZATION_LIST + queryList);
  };

  addHoliday = async (data) => {
    return this.http.put(API_PATH.USER.ADD_HOLIDAY, data);
  };
  getHolidayList = async (queryList) => {
    return this.http.get(API_PATH.USER.HOLIDAY_LIST + queryList);
  };
  HolidayDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.HOLIDAY_DELETE + queryList);
  };
  getHolidayListId = async (queryList) => {
    return this.http.get(API_PATH.USER.HOLIDAY_LIST_ID + queryList);
  };
  addTask = async (data) => {
    return this.http.put(API_PATH.USER.ADD_TASK, data);
  };
  getTaskList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_TASK_LIST + queryList);
  };
  taskDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.DELETE_TASK + queryList);
  };
  getTaskId = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_TASK_ID + queryList);
  };

  getGroupList = async () => {
    return this.http.get(API_PATH.USER.GROUP_LIST);
  };

  subGroup = async (data) => {
    return this.http.put(API_PATH.USER.SUB_GROUP, data);
  };

  getSubGroupList = async (queryList) => {
    return this.http.get(API_PATH.USER.SUB_GROUP + queryList);
  };

  role = async (data) => {
    return this.http.put(API_PATH.USER.ROLE, data);
  };

  getRoleList = async (queryList) => {
    return this.http.get(API_PATH.USER.ROLE + queryList);
  };

  addFollowUp = async (data) => {
    return this.http.put(API_PATH.USER.ADD_FOLLOW_UP_category, data);
  };
  getFollowUPList = async (queryList) => {
    return this.http.get(API_PATH.USER.FOLLOW_UP_category_LIST + queryList);
  };
  followUpDelete = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.FOLLOW_UP_category_DELETE + queryList
    );
  };
  getFollowUpId = async (queryList) => {
    return this.http.get(API_PATH.USER.FOLLOW_UP_categoryLIST_ID + queryList);
  };
  addWorkStatus = async (data) => {
    return this.http.put(API_PATH.USER.ADD_WORK_STATUS, data);
  };
  getWorkStatusList = async (queryList) => {
    return this.http.get(API_PATH.USER.WORK_STATUS_LIST + queryList);
  };
  WorkStatusDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.WORK_STATUS_DELETE + queryList);
  };
  getWorkStatusId = async (queryList) => {
    return this.http.get(API_PATH.USER.WORK_STATUS_LIST_ID + queryList);
  };
  addObservationType = async (data) => {
    return this.http.put(API_PATH.USER.ADD_OBSERVATION_TYPE, data);
  };
  getObservationTypeList = async (queryList) => {
    return this.http.get(API_PATH.USER.OBSERVATION_TYPE_LIST + queryList);
  };
  ObservationTypeDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.OBSERVATION_TYPE_DELETE + queryList);
  };

  addJobRound = async (data) => {
    return this.http.put(API_PATH.USER.ADD_JOB_ROUND, data);
  };
  getJobRoundList = async (queryList) => {
    return this.http.get(API_PATH.USER.JOB_ROUND_LIST + queryList);
  };
  JobRoundDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.JOB_ROUND_DELETE + queryList);
  };
  getJobRoundId = async (queryList) => {
    return this.http.get(API_PATH.USER.JOB_ROUND_LIST_ID + queryList);
  };

  addMedium = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MEDIUM, data);
  };
  getMediumList = async (queryList) => {
    return this.http.get(API_PATH.USER.MEDIUM_LIST + queryList);
  };
  MediumDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.MEDIUM_DELETE + queryList);
  };
  getMediumId = async (queryList) => {
    return this.http.get(API_PATH.USER.MEDIUM_LIST_ID + queryList);
  };
  getMediumDetailsId = async (id) => {
    return this.http.get(API_PATH.USER.MEDIUM_LIST_DETAILS_ID + id);
  };
  addDivision = async (data) => {
    return this.http.put(API_PATH.USER.ADD_DIVISION, data);
  };
  getDivisionList = async (queryList) => {
    return this.http.get(API_PATH.USER.DIVISION_LIST + queryList);
  };
  DivisionDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.DIVISION_DELETE + queryList);
  };
  getDivisionId = async (queryList) => {
    return this.http.get(API_PATH.USER.DIVISION_LIST_ID + queryList);
  };
  addDesignation = async (data) => {
    return this.http.put(API_PATH.USER.ADD_DESIGNATION, data);
  };
  getDesignationList = async (queryList) => {
    return this.http.get(API_PATH.USER.DESIGNATION_LIST + queryList);
  };
  DesignationDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.DESIGNATION_DELETE + queryList);
  };
  getDesignationId = async (queryList) => {
    return this.http.get(API_PATH.USER.DESIGNATION_LIST_ID + queryList);
  };

  addStandard = async (data) => {
    return this.http.put(API_PATH.USER.ADD_STANDARD, data);
  };
  getStandardList = async (queryList) => {
    return this.http.get(API_PATH.USER.STANDARD_LIST + queryList);
  };
  StandardDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.STANDARD_DELETE + queryList);
  };
  getStandardId = async (queryList) => {
    return this.http.get(API_PATH.USER.STANDARD_LIST_ID + queryList);
  };
  getStandardListById = async (queryList) => {
    return this.http.get(API_PATH.USER.STANDARD_LIST_BY_ID + queryList);
  };
  getDivisionListById = async (id) => {
    return this.http.get(API_PATH.USER.STANDARD_WISE_DIVISION + id);
  };

  addExam = async (data) => {
    return this.http.put(API_PATH.USER.ADD_EXAM, data);
  };
  getExamList = async (queryList) => {
    return this.http.get(API_PATH.USER.EXAM_LIST + queryList);
  };
  ExamDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.EXAM_DELETE + queryList);
  };
  getExamId = async (queryList) => {
    return this.http.get(API_PATH.USER.EXAM_LIST_ID + queryList);
  };

  addSubject = async (data) => {
    return this.http.put(API_PATH.USER.ADD_SUBJECT, data);
  };
  getSubjectList = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBJECT_LIST + queryList);
  };
  SubjectDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.SUBJECT_DELETE + queryList);
  };
  getSubjectId = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBJECT_LIST_ID + queryList);
  };
  getSubjectListById = async (id) => {
    return this.http.get(API_PATH.USER.SUBJECT_LIST_BY_ID + id);
  };
  addSubjectSequence = async (data) => {
    return this.http.put(API_PATH.USER.SUBJECT_LIST_SEQUENCE, data);
  };
  addSubjectLessonPlanningSequence = async (data) => {
    return this.http.put(API_PATH.USER.SUBJECT_LIST_SEQUENCE, data);
  };

  // Subject Category
  getSubjectCategoryList = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBJECT_CATEGORY_LIST + queryList);
  };
  addSubjectCategory = async (data) => {
    return this.http.put(API_PATH.USER.ADD_SUBJECT_CATEGORY, data);
  };
  getSubjectCategoryId = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBJECT_CATEGORY_LIST + queryList);
  };
  subjectCategoryDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.SUBJECT_CATEGORY_DELETE + queryList);
  };

  // Medium Wise Subject Priority
  getMediumSubjectPriorityList = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBJECT_PRIORITY_LIST + queryList);
  };
  addMediumSubjectPriority = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MEDIUM_SUBJECT_PRIORITY, data);
  };
  deleteMediumSubjectPriority = async (queryList) => {
    return this.http.delete(API_PATH.USER.SUBJECT_PRIORITY_DELETE + queryList);
  };
  addMediumSubjectPrioritySequence = async (data) => {
    return this.http.put(API_PATH.USER.SUBJECT_PRIORITY_SEQUENCE, data);
  };

  // Medium and Standard Wise Subject Assignment
  getSubjectAssignmentList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.MEDIUM_STANDARD_SUBJECT_ASSIGNMENT_LIST + queryList
    );
  };
  addMediumStandardWiseSubjectAssignment = async (data) => {
    return this.http.put(
      API_PATH.USER.ADD_MEDIUM_STANDARD_SUBJECT_ASSIGNMENT,
      data
    );
  };
  deleteMediumStandardWiseSubjectAssignment = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.MEDIUM_STANDARD_SUBJECT_ASSIGNMENT_DELETE + queryList
    );
  };

  // Student Wise Optional Subject Assignment
  getStudOptionalSubjAssignmentList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT_LIST + queryList
    );
  };
  addStudOptionalSubjAssignment = async (data) => {
    return this.http.put(
      API_PATH.USER.ADD_STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT,
      data
    );
  };
  deleteStudOptionalSubjAssignment = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.STUDENT_OPTIONAL_SUBJECT_ASSIGNMENT_DELETE + queryList
    );
  };

  // Subject Wise Lesson Planning
  getSubjectWiseLessonPlanningList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.SUBJECT_WISE_LESSON_PLANNING_LIST + queryList
    );
  };
  addSubjectWiseLessonSequence = async (data) => {
    return this.http.put(
      API_PATH.USER.SUBJECT_WISE_LESSON_PLANNING_LIST_SEQUENCE,
      data
    );
  };
  addSubjectWiseLessonPlanning = async (data) => {
    return this.http.put(API_PATH.USER.ADD_SUBJECT_WISE_LESSON_PLANNING, data);
  };
  deleteSubjectWiseLessonPlanning = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.SUBJECT_WISE_LESSON_PLANNING_DELETE + queryList
    );
  };

  // Lesson wise topic and subtopic entry
  getLessonWiseTopicSubtopicList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.LESSON_WISE_TOPIC_SUBTOPIC_LIST + queryList
    );
  };
  addLessonWiseTopicSubtopic = async (data) => {
    return this.http.put(API_PATH.USER.ADD_LESSON_WISE_TOPIC_SUBTOPIC, data);
  };
  deleteLessonWiseTopic = async (queryList) => {
    return this.http.delete(API_PATH.USER.LESSON_WISE_TOPIC_DELETE + queryList);
  };
  deleteLessonWiseSubtopic = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.LESSON_WISE_SUBTOPIC_DELETE + queryList
    );
  };
  editLessonWiseSubtopic = async (data) => {
    return this.http.put(API_PATH.USER.EDIT_LESSON_WISE_SUBTOPIC, data);
  };
  editLessonWiseTopic = async (data) => {
    return this.http.put(API_PATH.USER.EDIT_LESSON_WISE_TOPIC, data);
  };
  addTopicWiseSubtopic = async (data) => {
    return this.http.put(API_PATH.USER.ADD_TPOIC_WISE_SUBTOPIC, data);
  };
  getTopicList = async (queryList) => {
    return this.http.get(API_PATH.USER.LESSON_WISE_TOPIC_LIST + queryList);
  };

  // LO level master
  getLOLevelList = async (queryList) => {
    return this.http.get(API_PATH.USER.LO_LEVEL_LIST + queryList);
  };
  getLOLevelById = async (queryList) => {
    return this.http.get(API_PATH.USER.LO_LEVEL_LIST_ID + queryList);
  };
  addLOLevel = async (data) => {
    return this.http.put(API_PATH.USER.ADD_LO_LEVEL, data);
  };
  LOLevelDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.LO_LEVEL_DELETE + queryList);
  };
  addLOLevelSequence = async (data) => {
    return this.http.put(API_PATH.USER.LO_LEVEL_SEQUENCE, data);
  };

  // Add Topic Wise LO
  getTopicWiseLOList = async (queryList) => {
    return this.http.get(API_PATH.USER.TOPIC_WISE_LO_LIST + queryList);
  };
  addTopicWiseLO = async (data) => {
    return this.http.put(API_PATH.USER.ADD_TOPIC_WISE_LO, data);
  };
  topicWiseLODelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.TOPIC_WISE_LO_DELETE + queryList);
  };

  // Add Question type master
  getQuestionTypeMasterList = async (queryList) => {
    return this.http.get(API_PATH.USER.QUESTION_TYPE_MASTER_LIST + queryList);
  };
  getQuestionTypeMasterByIdList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.QUESTION_TYPE_MASTER_BY_ID_LIST + queryList
    );
  };
  addQuestionTypeMaster = async (data) => {
    return this.http.put(API_PATH.USER.ADD_QUESTION_TYPE_MASTER, data);
  };
  questionTypeMasterDelete = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.QUESTION_TYPE_MASTER_DELETE + queryList
    );
  };

  // Add Question type difficulty level master
  getQuestionTypeDifficultyMasterList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.QUESTION_TYPE_DIFFICULTY_LEVEL_LIST + queryList
    );
  };
  getQuestionTypeDifficultyMasterById = async (queryList) => {
    return this.http.get(
      API_PATH.USER.QUESTION_TYPE_DIFFICULTY_LEVEL_BY_ID_LIST + queryList
    );
  };
  addQuestionTypeDifficultyMaster = async (data) => {
    return this.http.put(
      API_PATH.USER.ADD_QUESTION_TYPE_DIFFICULTY_LEVEL_MASTER,
      data
    );
  };
  questionTypeDifficultyMasterDelete = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.QUESTION_TYPE_DIFFICULTY_LEVEL_DELETE + queryList
    );
  };

  // Add Question LO wise
  addQuestion = async (data) => {
    return this.http.put(API_PATH.USER.ADD_QUESTION, data);
  };
  getQuestions = async (queryList) => {
    return this.http.get(API_PATH.USER.QUESTIONS_LIST + queryList);
  };
  questionDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.QUESTION_DELETE + queryList);
  };

  addClass = async (data) => {
    return this.http.put(API_PATH.USER.ADD_CLASS, data);
  };
  getClassList = async (queryList) => {
    return this.http.get(API_PATH.USER.CLASS_LIST + queryList);
  };
  classDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.CLASS_DELETE + queryList);
  };
  getClassId = async (queryList) => {
    return this.http.get(API_PATH.USER.CLASS_LIST_ID + queryList);
  };
  addCommonResource = async (data) => {
    return this.http.put(API_PATH.USER.ADD_COMMON_RESOURCE, data);
  };
  getCommonResourceList = async (queryList) => {
    return this.http.get(API_PATH.USER.COMMON_RESOURCE_LIST + queryList);
  };
  CommonResourceDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.COMMON_RESOURCE_DELETE + queryList);
  };
  getCommonResourceId = async (queryList) => {
    return this.http.get(API_PATH.USER.COMMON_RESOURCE_LIST_ID + queryList);
  };
  addObservationMaster = async (data) => {
    return this.http.put(API_PATH.USER.ADD_OBSERVATION, data);
  };
  getObservationMasterList = async (queryList) => {
    return this.http.get(API_PATH.USER.OBSERVATION_LIST + queryList);
  };
  ObservationMasterDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.OBSERVATION_DELETE + queryList);
  };
  getObservationMasterId = async (queryList) => {
    return this.http.get(API_PATH.USER.OBSERVATION_LIST_ID + queryList);
  };
  addRoute = async (data) => {
    return this.http.put(API_PATH.USER.ADD_ROUTE, data);
  };
  getRouteList = async (queryList) => {
    return this.http.get(API_PATH.USER.ROUTE_LIST + queryList);
  };
  routeDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.ROUTE_DELETE + queryList);
  };
  getRouteId = async (queryList) => {
    return this.http.get(API_PATH.USER.ROUTE_LIST_ID + queryList);
  };
  addState = async (data) => {
    return this.http.put(API_PATH.USER.ADD_STATE, data);
  };
  getStateList = async (queryList) => {
    return this.http.get(API_PATH.USER.STATE_LIST + queryList);
  };
  StateDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.STATE_DELETE + queryList);
  };
  getStateId = async (queryList) => {
    return this.http.get(API_PATH.USER.STATE_LIST_ID + queryList);
  };
  addLeave = async (data) => {
    return this.http.put(API_PATH.USER.ADD_LEAVE_TYPE, data);
  };
  getLeaveList = async (queryList) => {
    return this.http.get(API_PATH.USER.LEAVE_TYPE_LIST + queryList);
  };
  LeaveDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.LEAVE_TYPE_DELETE + queryList);
  };
  getLeaveId = async (queryList) => {
    return this.http.get(API_PATH.USER.LEAVE_TYPE_LIST_ID + queryList);
  };
  // Work category
  addMeetingCategory = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MEETING_CATEGORY, data);
  };
  getMeetingCategoryList = async (queryList) => {
    return this.http.get(API_PATH.USER.MEETING_CATEGORY_LIST + queryList);
  };
  MeetingCategoryDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.MEETING_CATEGORY_DELETE + queryList);
  };
  getMeetingCategoryId = async (queryList) => {
    return this.http.get(API_PATH.USER.MEETING_CATEGORY_LIST_ID + queryList);
  };
  //Work Category
  addWorkCategory = async (data) => {
    return this.http.put(API_PATH.USER.ADD_WORK_CATEGORY, data);
  };
  getWorkCategoryList = async (queryList) => {
    return this.http.get(API_PATH.USER.WORK_CATEGORY_LIST + queryList);
  };
  WorkCategoryDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.WORK_CATEGORY_DELETE + queryList);
  };
  getWorkCategoryId = async (queryList) => {
    return this.http.get(API_PATH.USER.WORK_CATEGORY_LIST_ID + queryList);
  };
  //submission
  addSubmissionCategory = async (data) => {
    return this.http.put(API_PATH.USER.ADD_SUBMISSION, data);
  };
  getSubmissionList = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBMISSION_LIST + queryList);
  };
  SubmissionDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.SUBMISSION_DELETE + queryList);
  };
  getSubmissionId = async (queryList) => {
    return this.http.get(API_PATH.USER.SUBMISSION_LIST_ID + queryList);
  };

  // get menu list

  getMenuList = async () => {
    return this.http.get(API_PATH.USER.MENU_LIST);
  };

  getMenuByRoleId = async (queryList) => {
    return this.http.get(API_PATH.USER.MENU_BY_ROLE_ID + queryList);
  };

  addMenuByRoleId = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MENU_BY_ROLE, data);
  };

  getStaffRoleById = async (queryList) => {
    return this.http.get(API_PATH.USER.ADD_STAFF + queryList);
  };
  //city
  addCity = async (data) => {
    return this.http.put(API_PATH.USER.ADD_CITY, data);
  };
  getCityList = async (queryList) => {
    return this.http.get(API_PATH.USER.CITY_LIST + queryList);
  };
  getCityListById = async (id) => {
    return this.http.get(API_PATH.USER.CITY_LIST_BY_ID + `/${id}`);
  };
  cityDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.CITY_DELETE + queryList);
  };
  getCityId = async (queryList) => {
    return this.http.get(API_PATH.USER.CITY_LIST_ID + queryList);
  };
  //area
  addArea = async (data) => {
    return this.http.put(API_PATH.USER.ADD_AREA, data);
  };
  getAreaList = async (queryList) => {
    return this.http.get(API_PATH.USER.AREA_LIST + queryList);
  };
  getAreaListId = async (queryList) => {
    return this.http.get(API_PATH.USER.AREA_LIST_BY_ID + queryList);
  };

  areaDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.AREA_DELETE + queryList);
  };
  getAreaId = async (queryList) => {
    return this.http.get(API_PATH.USER.AREA_LIST_ID + queryList);
  };

  addPoint = async (data) => {
    return this.http.put(API_PATH.USER.ADD_POINT, data);
  };
  getPointList = async (queryList) => {
    return this.http.get(API_PATH.USER.PONIT_LIST + queryList);
  };
  PointDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.PONIT_DELETE + queryList);
  };
  getPointId = async (queryList) => {
    return this.http.get(API_PATH.USER.PONIT_LIST_ID + queryList);
  };
  addCourse = async (data) => {
    return this.http.put(API_PATH.USER.ADD_COURSE, data);
  };
  getCourseList = async (queryList) => {
    return this.http.get(API_PATH.USER.COURSE_LIST + queryList);
  };
  CourseDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.COURSE_DELETE + queryList);
  };
  getCourseId = async (queryList) => {
    return this.http.get(API_PATH.USER.COURSE_LIST_ID + queryList);
  };
  addChapter = async (data) => {
    return this.http.put(API_PATH.USER.ADD_CHAPTER, data);
  };
  getChapterList = async (queryList) => {
    return this.http.get(API_PATH.USER.CHAPTER_LIST + queryList);
  };
  ChapterDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.CHAPTER_DELETE + queryList);
  };
  getChapterId = async (queryList) => {
    return this.http.get(API_PATH.USER.CHAPTER_LIST_ID + queryList);
  };
  addLeaveSeting = async (data) => {
    return this.http.put(API_PATH.USER.PUT_LEAVE_SETING, data);
  };
  getLeaveSeting = async () => {
    return this.http.get(API_PATH.USER.GET_LEAVE_SETING);
  };

  addDepartment = async (data) => {
    return this.http.put(API_PATH.USER.ADD_DEPARTMENT, data);
  };
  getDepartmentList = async (queryList) => {
    return this.http.get(API_PATH.USER.DEPARTMENT_LIST + queryList);
  };
  DepartmentDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.DEPARTMENT_DELETE + queryList);
  };
  getDepartmentId = async (queryList) => {
    return this.http.get(API_PATH.USER.DEPARTMENT_LIST_ID + queryList);
  };
  // Staff
  addStaff = async (data) => {
    return this.http.put(API_PATH.USER.ADD_STAFF, data);
  };
  getStaffList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_STAFF + queryList);
  };
  addMeetingPointCategory = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MEETING_POINT_CATEGORY, data);
  };
  MeetingPointCategoryList = async (queryList) => {
    return this.http.get(API_PATH.USER.MEETING_POINT_CATEGORY_LIST + queryList);
  };
  MeetingPointCategoryDelete = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.MEETING_POINT_CATEGORY_DELETE + queryList
    );
  };
  MeetingPointCategoryId = async (queryList) => {
    return this.http.get(
      API_PATH.USER.MEETING_POINT_CATEGORY_LIST_ID + queryList
    );
  };
  addStaffRoom = async (data) => {
    return this.http.put(API_PATH.USER.ADD_STAFF_ROOM, data);
  };
  StaffRoomList = async (queryList) => {
    return this.http.get(API_PATH.USER.STAFF_ROOM_LIST + queryList);
  };
  StaffRoomDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.STAFF_ROOM_DELETE + queryList);
  };
  StaffRoomId = async (queryList) => {
    return this.http.get(API_PATH.USER.STAFF_ROOM_LIST_ID + queryList);
  };

  addDocumentSetting = async (data) => {
    return this.http.put(API_PATH.USER.DOCUMENT_SETTING, data);
  };
  DocumentSettingList = async (queryList) => {
    return this.http.get(API_PATH.USER.DOCUMENT_SETTING_LIST + queryList);
  };
  DocumentSettingDelete = async (queryList) => {
    return this.http.delete(API_PATH.USER.DOCUMENT_SETTING_DELETE + queryList);
  };
  DocumentSettingId = async (queryList) => {
    return this.http.get(API_PATH.USER.DOCUMENT_SETTING_LIST_ID + queryList);
  };

  editProfileSuperAdmin = async (data) => {
    return this.http.put(API_PATH.USER.EDIT_SUPER_ADMIN_PROFILE, data);
  };
  editOrganizationProfile = async (data) => {
    return this.http.put(API_PATH.USER.EDIT_ORGANIZATION_PROFILE, data);
  };
  staffAddVerifyEmail = async (data) => {
    return this.http.post(API_PATH.USER.VERIFY_EMAIL_STAFF_ADD, data);
  };
  getRepotingCutOffList = async (queryList) => {
    return this.http.get(API_PATH.USER.LIST_REPORTING_CUT_OFF + queryList);
  };
  addRepotingCutOff = async (data) => {
    return this.http.put(API_PATH.USER.ADD_REPORTING_CUT_OFF, data);
  };
  deleteRepotingCutOff = async (queryList) => {
    return this.http.delete(API_PATH.USER.DELETE_REPORTING_CUT_OFF + queryList);
  };
  schoolGroupMasterList = async (queryList) => {
    return this.http.get(API_PATH.USER.LIST_SCHOOL_GROUP + queryList);
  };
  addSchoolGroupMaster = async (data) => {
    return this.http.put(API_PATH.USER.ADD_SCHOOL_GROUP, data);
  };
  deleteSchoolGroupMaster = async (queryList) => {
    return this.http.delete(API_PATH.USER.DELETE_SCHOOL_GROUP + queryList);
  };
  reportingFrameworkList = async (queryList) => {
    return this.http.get(API_PATH.USER.LIST_RESPORTING_FRAMEWORK + queryList);
  };
  addReportingFramework = async (data) => {
    return this.http.put(API_PATH.USER.ADD_RESPORTING_FRAMEWORK, data);
  };
  deleteReportingFramework = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.DELETE_RESPORTING_FRAMEWORK + queryList
    );
  };
  ObservationSubworkingList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.LIST_OBSERVATION_WORKING_AREA + queryList
    );
  };
  addObservationSubworking = async (data) => {
    return this.http.put(API_PATH.USER.ADD_OBSERVATION_WORKING_AREA, data);
  };
  deleteObservationSubworking = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.DELETE_OBSERVATION_WORKING_AREA + queryList
    );
  };
  observationRelatedToList = async (queryList) => {
    return this.http.get(API_PATH.USER.LIST_OBSERVATION_RELATED_TO + queryList);
  };
  addObservationRelatedTo = async (data) => {
    return this.http.put(API_PATH.USER.ADD_OBSERVATION_RELATED_TO, data);
  };
  deleteObservationRelatedTo = async (queryList) => {
    return this.http.delete(
      API_PATH.USER.DELETE_OBSERVATION_RELATED_TO + queryList
    );
  };

  // Static students
  getStudentList = async (queryList) => {
    return this.http.get(API_PATH.USER.STUDENT_LIST + queryList);
  };

  // Delete Attachment
  deleteAttachment = async (data) => {
    return this.http.put(API_PATH.USER.DELETE_ATTACHMENT, data);
  };

  getdeleteAttachment = async () => {
    return this.http.get(API_PATH.USER.DELETE_ATTACHMENT);
  };

  // Reporting

  getALLReporting = async (queryList) => {
    return this.http.get(API_PATH.USER.ALL_REPORTING + queryList);
  };

  getStatisticsReporting = async (queryList) => {
    return this.http.get(API_PATH.USER.STATISTICS_REPORTING + queryList);
  };
  getAllStaff = async () => {
    return this.http.get(API_PATH.USER.GET_ALL_STAFF);
  };

  //Subject Material Type
  addSubjectMaterialType = async (data) => {
    return this.http.post(API_PATH.USER.ADD_SUBJECT_MATERIAL_TYPE, data);
  };
  updateSubjectMaterialType = async (id, data) => {
    return this.http.patch(
      API_PATH.USER.UPDATE_SUBJECT_MATERIAL_TYPE + id,
      data
    );
  };
  getSubjectMaterialType = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_SUBJECT_MATERIAL_TYPE + queryList);
  };
  getByIdSubjectMaterialType = async (id) => {
    return this.http.get(API_PATH.USER.GET_BY_ID_SUBJECT_MATERIAL_TYPE + id);
  };
  deleteSubjectMaterialType = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_SUBJECT_MATERIAL_TYPE + id);
  };
  addMaterial = async (data) => {
    return this.http.put(API_PATH.USER.ADD_MATERIALS, data);
  };
  getMaterial = async (queryList) => {
    return this.http.get(API_PATH.USER.LIST_MATERIALS + queryList);
  };
  // getByIdMaterial = async (id) => {
  //   return this.http.get(API_PATH.USER.GET_BY_ID_MATERIALS + id);
  // };
  deleteMaterial = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MATERIALS + id);
  };
  //Subject Material Type Category
  updateSubjectMaterialTypeCategory = async (data) => {
    return this.http.put(
      API_PATH.USER.UPDATE_SUBJECT_MATERIAL_TYPE_CATEGORY,
      data
    );
  };
  getSubjectMaterialTypeCategory = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_SUBJECT_MATERIAL_TYPE_CATEGORY + queryList
    );
  };
  getByIdSubjectMaterialTypeCategory = async (id) => {
    return this.http.get(
      API_PATH.USER.GET_BY_ID_SUBJECT_MATERIAL_TYPE_CATEGORY + id
    );
  };
  deleteSubjectMaterialTypeCategory = async (id) => {
    return this.http.delete(
      API_PATH.USER.DELETE_SUBJECT_MATERIAL_TYPE_CATEGORY + id
    );
  };

  // Session
  updateSession = async (data) => {
    return this.http.post(API_PATH.USER.UPDATE_SESSION, data);
  };
  getSessionList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_SESSION + queryList);
  };
  deleteSession = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_SESSION + id);
  };

  // Academic Year
  updateAcademicYear = async (data) => {
    return this.http.post(API_PATH.USER.UPDATE_ACADEMIC_YEAR, data);
  };
  getAcademicYearList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_ACADEMIC_YEAR + queryList);
  };
  deleteAcademicYear = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_ACADEMIC_YEAR + id);
  };

  // Academic Year validation
  updateAcademicYearValidation = async (data) => {
    return this.http.post(API_PATH.USER.UPDATE_ACADEMIC_YEAR_VALIDATION, data);
  };
  getAcademicYearValidationList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_ACADEMIC_YEAR_VALIDATION + queryList
    );
  };
  deleteAcademicYearValidation = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_ACADEMIC_YEAR_VALIDATION + id);
  };

  // Source Of Information
  updateSourceOfInformation = async (data) => {
    return this.http.post(API_PATH.USER.UPDATE_SOURCE_OF_INFORMATION, data);
  };
  getSourceOfInformationList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_SOURCE_OF_INFORMATION + queryList);
  };
  deleteSourceOfInformation = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_SOURCE_OF_INFORMATION + id);
  };

  addMasterState = async (queryList) => {
    return this.http.put(API_PATH.USER.UPADTE_MASTER_STATE, queryList);
  };
  getByIdMasterState = async (id) => {
    return this.http.get(API_PATH.USER.GET_MASTER_STATE + id);
  };
  deleteMasterState = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MASTER_STATE + id);
  };
  addMasterDistrict = async (queryList) => {
    return this.http.put(API_PATH.USER.UPADTE_MASTER_DISTRICT, queryList);
  };
  getByIdMasterDistrict = async (id) => {
    return this.http.get(API_PATH.USER.GET_MASTER_DISTRICT + id);
  };
  deleteMasterDistrict = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MASTER_DISTRICT + id);
  };
  addMasterSubDistrict = async (queryList) => {
    return this.http.put(API_PATH.USER.UPADTE_MASTER_SUB_DISTRICT, queryList);
  };
  getByIdMasterSubDistrict = async (id) => {
    return this.http.get(API_PATH.USER.GET_MASTER_SUB_DISTRICT + id);
  };
  deleteMasterSubDistrict = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MASTER_SUB_DISTRICT + id);
  };
  addMasterVillage = async (queryList) => {
    return this.http.put(API_PATH.USER.UPADTE_MASTER_VILLAGE, queryList);
  };
  getByIdMasterVillage = async (id) => {
    return this.http.get(API_PATH.USER.GET_MASTER_VILLAGE + id);
  };
  deleteMasterVillage = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MASTER_VILLAGE + id);
  };
  addMasterPincode = async (queryList) => {
    return this.http.put(API_PATH.USER.UPADTE_MASTER_PINCODE, queryList);
  };
  getByIdMasterPincode = async (id) => {
    return this.http.get(API_PATH.USER.GET_MASTER_PINCODE + id);
  };
  deleteMasterPincode = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_MASTER_PINCODE + id);
  };
  addTimeSlot = async (queryList) => {
    return this.http.put(API_PATH.USER.UPDATE_TIME_SLOT, queryList);
  };
  getByIdTimeSlot = async (id) => {
    return this.http.get(API_PATH.USER.GET_TIME_SLOT + id);
  };
  deleteTimeSlot = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_TIME_SLOT + id);
  };
  addLeaveRecord = async (queryList) => {
    return this.http.put(API_PATH.USER.ADD_LEAVE_RECORD, queryList);
  };
  getLeaveRecordList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_LEAVE_RECORD + queryList);
  };
  deleteLeaveRecord = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_LEAVE_RECORD + id);
  };
  addHeadGroupMaster = async (queryList) => {
    return this.http.put(API_PATH.USER.ADD_HEAD_GROUP_MASTER, queryList);
  };
  getHeadGroupMaster = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_HEAD_GROUP_MASTER + queryList);
  };
  getHeadGroupMasterById = async (id) => {
    return this.http.get(API_PATH.USER.GET_HEAD_GROUP_MASTER_BY_ID + id);
  };
  deleteHeadGroupMaster = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_HEAD_GROUP_MASTER + id);
  };
  addGroupMaster = async (queryList) => {
    return this.http.put(API_PATH.USER.ADD_GROUP_MASTER, queryList);
  };
  getGroupMaster = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_GROUP_MASTER + queryList);
  };
  getGroupMasterById = async (id) => {
    return this.http.get(API_PATH.USER.GET_GROUP_MASTER_BY_ID + id);
  };
  deleteGroupMaster = async (id) => {
    return this.http.delete(API_PATH.USER.DELETE_GROUP_MASTER + id);
  };
  addHeadAndGroupMaster = async (queryList) => {
    return this.http.put(
      API_PATH.USER.ADD_HEAD_AND_GROUP_MAPPING_MASTER,
      queryList
    );
  };
  getHeadAndGroupMaster = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_HEAD_AND_GROUP_MAPPING_MASTER + queryList
    );
  };
  getHeadAndGroupMasterById = async (id) => {
    return this.http.get(
      API_PATH.USER.GET_HEAD_AND_GROUP_MAPPING_MASTER_BY_ID + id
    );
  };
  deleteHeadAndGroupMaster = async (id) => {
    return this.http.delete(
      API_PATH.USER.DELETE_HEAD_AND_GROUP_MAPPING_MASTER + id
    );
  };
  updateLcApprocalFeeRecord = async (data, id) => {
    return this.http.patch(
      API_PATH.USER.UPDATE_LC_APPROCAL_FEES_RECORD + id,
      data
    );
  };
  getLcApprocalFeeRecordList = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_LIST_LC_APPROCAL_FEES_RECORD + queryList
    );
  };
  getByIdLcApprocalFeeRecord = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_BY_ID_LC_APPROCAL_FEES_RECORD + queryList
    );
  };
  getlcList = async (queryList) => {
    return this.http.get(API_PATH.USER.LEAVE_CERTIFICATE_LIST + queryList);
  };
  getFeesCategory = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_FEE_CATEGORY_LIST + queryList);
  };
  updateGenerateLc = async (data) => {
    return this.http.post(API_PATH.USER.POST_GENERATE_LC, data);
  };
  getGenerateLcList = async (queryList) => {
    return this.http.get(API_PATH.USER.GET_GENERATE_LC + queryList);
  };

  razorpayRefundPayment = async (data) => {
    return this.http.post(API_PATH.USER.REFUND_PAYMENT, data);
  };

  //---- Fee Category Master ----
  addFeeCategory = async (data) => {
    return this.http.post(API_PATH.USER.FEE_CATEGORY, data);
  };
  getFeeCategoryMaster = async (queryList) => {
    return this.http.get(API_PATH.USER.FEE_CATEGORY + queryList);
  };
  deleteFeeCategoryMaster = async (id) => {
    return this.http.delete(`${API_PATH.USER.FEE_CATEGORY}/${id}`);
  };
  //---- Fee Category Master End ----

  //-- Custom Field Sequence ----
  addFieldSequence = async (data) => {
    return this.http.post(API_PATH.USER.CUSTOM_FIELD_SEQUENCE, data);
  };
  addStepSequence = async (data) => {
    return this.http.post(API_PATH.USER.CUSTOM_FIELD_STEP_SEQUENCE, data);
  };
  //-- Custom Field Sequence End----

  //---- Assign Document to Standard ----
  getAssignedDocumentList = async (queryList) => {
    return this.http.get(API_PATH.USER.ASSIGN_DOCUMENT_MASTER + queryList);
  };
  assignDocumentToStandard = async (data) => {
    return this.http.put(API_PATH.USER.ASSIGN_DOCUMENT_MASTER, data);
  };
  deleteAssignedDocumentToStandard = async (id) => {
    return this.http.delete(`${API_PATH.USER.ASSIGN_DOCUMENT_MASTER}/${id}`);
  };
  //---- Assign Document to Standard End ----
  addStandardWiseCategoryWiseMapping = async (queryList) => {
    return this.http.put(
      API_PATH.USER.ADD_STD_WISE_CATEGORY_WISE_MAPPING,
      queryList
    );
  };
  getStandardWiseCategoryWiseMapping = async (queryList) => {
    return this.http.get(
      API_PATH.USER.GET_STD_WISE_CATEGORY_WISE_MAPPING_LIST + queryList
    );
  };
  getStandardWiseCategoryWiseMappingById = async (id) => {
    return this.http.get(
      API_PATH.USER.GET_STD_WISE_CATEGORY_WISE_MAPPING_BY_ID + id
    );
  };
  deleteStandardWiseCategoryWiseMapping = async (id) => {
    return this.http.delete(
      API_PATH.USER.DELETE_STD_WISE_CATEGORY_WISE_MAPPING + id
    );
  };
  getDivisionStudentList = async (id) => {
    return this.http.get(API_PATH.USER.GET_DIVISION_STUDDENT_LIST + id);
  };
  updateDivisionTransfer = async (data) => {
    return this.http.post(API_PATH.USER.UPDATE_DIVISION_TRANSFER, data);
  };
  getByIdDivisionTransferStudentList = async (id) => {
    return this.http.get(API_PATH.USER.GET_BY_ID_DIVISION_TRANSFER + id);
  };
  getTransferStudentList = async (id) => {
    return this.http.get(API_PATH.USER.GET_TRANSFER_STUDENT + id);
  };
  //Roll No
  getRollNoRows = async (queryList) => {
    return this.http.get(API_PATH.USER.ROLL_NO + queryList);
  };
  deleteRollNo = async (rollno) => {
    return this.http.delete(`${API_PATH.USER.ROLL_NO}/${rollno}`);
  };
  postRollNoRows = async (data) => {
    return this.http.post(API_PATH.USER.ROLL_NO_POST, data);
  };
  postRollNoUpdate = async (data, rollno) => {
    return this.http.patch(API_PATH.USER.ROLL_NO + rollno, data);
  };
  postRollNoFreeze = async (data) => {
    return this.http.post(API_PATH.USER.FREEZE_ROLL_NO, data);
  };
  patchRollNoFreeze = async (data) => {
    return this.http.post(API_PATH.USER.FREEZE_ROLL_NO_PATCH, data);
  };
}
