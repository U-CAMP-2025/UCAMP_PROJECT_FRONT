const jobs = [
  {
    jobId: 5,
    jobName: '자바 개발자',
  },
  {
    jobId: 7,
    jobName: '머신러닝 엔지니어',
  },
  {
    jobId: 8,
    jobName: 'C/C++ 개발자',
  },
  {
    jobId: 9,
    jobName: 'DevOps / 시스템 관리자',
  },
  {
    jobId: 11,
    jobName: '데이터 엔지니어',
  },
  {
    jobId: 12,
    jobName: 'Node.js 개발자',
  },
  {
    jobId: 13,
    jobName: '개발 매니저',
  },
  {
    jobId: 14,
    jobName: '임베디드 개발자',
  },
  {
    jobId: 16,
    jobName: '데이터 사이언티스트',
  },
  {
    jobId: 17,
    jobName: '빅데이터 엔지니어',
  },
  {
    jobId: 18,
    jobName: '안드로이드 개발자',
  },
  {
    jobId: 19,
    jobName: 'iOS 개발자',
  },
  {
    jobId: 21,
    jobName: '하드웨어 엔지니어',
  },
  {
    jobId: 22,
    jobName: '크로스플랫폼 앱 개발자',
  },
  {
    jobId: 23,
    jobName: '프로덕트 매니저',
  },
  {
    jobId: 24,
    jobName: '블록체인 플랫폼 엔지니어',
  },
  {
    jobId: 25,
    jobName: 'DBA',
  },
  {
    jobId: 26,
    jobName: '웹 퍼블리셔',
  },
  {
    jobId: 27,
    jobName: '영상/음성 엔지니어',
  },
  {
    jobId: 28,
    jobName: 'PHP 개발자',
  },
  {
    jobId: 29,
    jobName: '.NET 개발자',
  },
  {
    jobId: 30,
    jobName: 'CTO/Chief Technology Officer',
  },
  {
    jobId: 31,
    jobName: '그래픽스 엔지니어',
  },
  {
    jobId: 32,
    jobName: 'ERP전문가',
  },
  {
    jobId: 33,
    jobName: 'BI 엔지니어',
  },
  {
    jobId: 34,
    jobName: 'VR 엔지니어',
  },
  {
    jobId: 35,
    jobName: '루비온레일즈 개발자',
  },
  {
    jobId: 36,
    jobName: '테크니컬 라이터',
  },
  {
    jobId: 37,
    jobName: 'CIO/Chief Information Officer',
  },
  {
    jobId: 38,
    jobName: 'RPA 엔지니어',
  },
  {
    jobId: 1,
    jobName: '소프트웨어 엔지니어',
  },
  {
    jobId: 2,
    jobName: '서버 개발자',
  },
  {
    jobId: 3,
    jobName: '웹 개발자',
  },
  {
    jobId: 4,
    jobName: '프론트엔드 개발자',
  },
  {
    jobId: 6,
    jobName: '파이썬 개발자',
  },
  {
    jobId: 10,
    jobName: '시스템,네트워크 관리자',
  },
  {
    jobId: 15,
    jobName: 'QA,테스트 엔지니어',
  },
  {
    jobId: 20,
    jobName: '기술지원',
  },
];

export const getJobId = (jobName) => {
  const found = jobs.find((el) => el.jobName === jobName);
  return found ? found.jobId : 1; // 못 찾으면 fallback
};
