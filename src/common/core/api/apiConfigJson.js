export default {
  login: {
    url: '/app/login',
    method: 'POST',
    data: {
      email: '',
      password: '',
      deviceId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  updateUserStatus: {
    url: '/ui/user/updateUserStatus',
    method: 'PUT',
    data: {
      userId: '',
      isActive: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  signupUser: {
    url: 'app/signup',
    method: 'POST',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
      userId: '',
      createdBy: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  signupHR: {
    url: 'app/signuphr',
    method: 'POST',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
      userId: '',
      companyId: '',
      companyName: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  signupParent: {
    url: '/app/signup',
    method: 'POST',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
      students: [],
      invite: '',
      userId: '',
      password: '',
      dob: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  emailVerify: {
    url: '/app/user/verify',
    method: 'PUT',
    data: {
      code: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  roleType: {
    url: '/app/roleType',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  forgotPassword: {
    url: '/app/forgot/password?email=:email',
    method: 'POST',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },

  resetPassword: {
    url: '/app/reset/password',
    method: 'POST',
    data: {
      code: '',
      newPassword: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  logout: {
    url: '/ui/logout',
    method: 'post',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  changePassword: {
    url: '/ui/update/password',
    method: 'POST',
    data: {
      oldPassword: '',
      newPassword: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getUserDetails: {
    url: '/ui/user?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  addResume: {
    url: '/ui/userProfile/addResume',
    method: 'PUT',
    data: {
      userProfileId: '',
      userId: '',
      resumeURL: '',
      resumeName: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  addVideo: {
    url: '/ui/userProfile/saveVideo',
    method: 'PUT',
    data: {
      userId: '',
      userProfileId: '',
      videoLink: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getEmploymentListById: {
    url: '/ui/employment?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  addEmployment: {
    url: '/ui/employment',
    method: 'POST',
    data: {
      userId: '',
      designation: '',
      organisation: '',
      currentCompany: '',
      currentSalary: '',
      currentSalaryInLakh: '',
      currentSalaryInThousand: '',
      describe: '',
      noticePeriod: '',
      offeredSalary: '',
      offeredSalaryInLakh: '',
      offeredSalaryInThousand: '',
      offeredDesignation: '',
      startDate: '',
      endDate: '',
      lastWorkingDate: '',
      nextEmployer: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  editEmployment: {
    url: 'ui/employment',
    method: 'PUT',
    data: {
      userId: '',
      employmentId: '',
      designation: '',
      organisation: '',
      currentCompany: '',
      currentSalary: '',
      currentSalaryInLakh: '',
      currentSalaryInThousand: '',
      describe: '',
      noticePeriod: '',
      offeredSalary: '',
      offeredSalaryInLakh: '',
      offeredSalaryInThousand: '',
      offeredDesignation: '',
      startDate: '',
      endDate: '',
      lastWorkingDate: '',
      nextEmployer: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  deleteEmployment: {
    url: 'ui/employment?employmentId=:employmentId',
    method: 'DELETE',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },

  getSkillsListById: {
    url: 'api/v1/public/user/web/getSkillsListById/:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  //predefined values
  getKeySkillsList: {
    url: '/ui/skills',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  //predefined values
  getProfileRoleList: {
    url: '/ui/profileRole',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  //predefined values
  getCompanyList: {
    url: '/app/company',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getProjectListById: {
    url: '/ui/project?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getAssociatedListDataByUserId: {
    url: 'api/v1/public/user/web/getAssociatedListDataByUserId/:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  addProject: {
    url: '/ui/project',
    method: 'POST',
    data: {
      userId: '',
      projectName: '',
      projectURL: '',
      associatedWith: '',
      projectFinished: '',
      description: '',
      startDate: '',
      endDate: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  editProject: {
    url: '/ui/project',
    method: 'PUT',
    data: {
      userId: '',
      projectName: '',
      projectURL: '',
      associatedWith: '',
      projectFinished: '',
      description: '',
      startDate: '',
      endDate: '',
      projectId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getDesiredProfileListById: {
    url: '/ui/careerProfile?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  addCareerProfile: {
    url: '/ui/careerProfile',
    method: 'POST',
    data: {
      userId: '',
      industry: '',
      functionalArea: '',
      role: '',
      jobType: '',
      employmentType: '',
      desiredShift: '',
      expectedSalary: '',
      expectedSalaryInLakh: '',
      expectedSalaryInThousand: '',
      desiredLocation: [],
      desiredIndustry: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  editDesiredProfileData: {
    url: '/ui/careerProfile',
    method: 'PUT',
    data: {
      userId: '',
      industry: '',
      functionalArea: '',
      role: '',
      jobType: '',
      profileId: '',
      employmentType: '',
      desiredShift: '',
      expectedSalary: '',
      expectedSalaryInLakh: '',
      expectedSalaryInThousand: '',
      desiredLocation: [],
      desiredIndustry: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  addJobDescription: {
    url: '/ui/jobDescription',
    method: 'POST',
    data: {
      userId: '',
      title: '',
      titleId: '',
      description: '',
      noOfPosition: 0,
      minExperience: 0,
      maxExperience: 0,
      location: [],
      postedBy: '',
      skills: [],
      jobDescId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getJobDescriptonListById: {
    url: '/ui/jobDescription?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  editJobDescriptionData: {
    url: '/ui/jobDescription',
    method: 'PUT',
    data: {
      recruiterId: '',
      companyId: '',
      title: '',
      description: '',
      noOfPosition: '',
      minExperience: '',
      maxExperience: '',
      location: [],
      skills: [],
      postedBy: '',
      jobDescId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  addUserSkills: {
    url: '/ui/userProfile',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      skills: [],
      profileRole: [],
      experienceInYear: 0,
      experienceInMonth: 0,
      currentLocation: 0,
      mobileNo: 0
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getUserSkillsById: {
    url: '/ui/userProfile?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  editUserSkills: {
    url: '/ui/userProfile',
    method: 'PUT',
    data: {
      userId: '',
      userProfileId: '',
      skills: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  editUserProfile: {
    url: '/ui/userProfile',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      userProfileId: '',
      profileRole: [],
      skills: [],
      experienceInYear: 0,
      experienceInMonth: 0,
      currentLocation: 0,
      mobileNo: 0
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  createInterviewersSkills: {
    url: 'api/v1/public/user/web/createInterviewersSkills',
    method: 'POST',
    data: {
      userId: '',
      keySkillId: '',
      skillId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getInterviewersSkillsListById: {
    url: 'api/v1/public/user/web/getInterviewersSkillsListById/:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  editInterviewersSkillsData: {
    url: 'api/v1/public/user/web/editInterviewersSkillsData',
    method: 'PUT',
    data: {
      userId: '',
      skills: '',
      skillId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  createSlot: {
    url: '/ui/timeSlot',
    method: 'POST',
    data: {
      slotId: '',
      slotRegisteredDate: '',
      startTimeStamp: '',
      endTimeStamp: '',
      interviewerId: '',
      userId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  modifySlot: {
    url: '/ui/timeSlot',
    method: 'PUT',
    data: {
      slotId: '',
      slotRegisteredDate: '',
      startTimeStamp: '',
      endTimeStamp: '',
      interviewerId: '',
      userId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  bookedTimeSlot: {
    url: '/ui/bookedTimeSlot',
    method: 'POST',
    data: {
      userId: '',
      slotRegisteredDate: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },

  deleteTimeSlotByInterviewer: {
    url: '/ui/deleteTimeSlot?slotId=:slotId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getTimeSlotByInterviewer: {
    url: '/ui/timeSlot?interviewerId=:interviewerId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getTimeSlotByUser: {
    url: '/ui/timeSlot?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  saveChatLink: {
    url: '/ui/saveChatLink',
    method: 'PUT',
    data: {
      slotId: '',
      roleId: '',
      videoChatLink: '',
      videoSkillTag: '',
      userId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getCandidateList: {
    url: '/ui/candidateList?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getHrList: {
    url: '/ui/hrList?userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  createJobMap: {
    url: '/ui/jobMap',
    method: 'POST',
    data: {
      jobMapId: '',
      jobId: '',
      candidateId: '',
      hrId: '',
      status: '',
      createdBy: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  updateProfileImage: {
    url: '/ui/user',
    method: 'PUT',
    data: {
      profilePicture: '',
      userId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },

  updateJobMap: {
    url: '/ui/jobMap',
    method: 'PUT',
    data: {
      jobMapId: '',
      jobId: '',
      candidateId: '',
      hrId: '',
      status: '',
      createdBy: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getUserListForMapping: {
    url: '/ui/jobMap?jobId=:jobId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getUserListForHR: {
    url: '/ui/getListForHR?jobId=:jobId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  getPreSignedURL: {
    url: '/ui/azure/upload',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  }
};
