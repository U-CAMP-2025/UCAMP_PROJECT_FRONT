import { useRef } from 'react';
import { useForm } from 'react-hook-form';

const styles = {
  // 1. 화면 전체 중앙 정렬 (body 역할을 가정)
  pageLayout: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  // 2. 회원 가입 컨테이너
  signupContainer: {
    width: '100%',
    maxWidth: '500px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  // 3. 폼 그룹
  inputGroup: {
    marginBottom: '20px',
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  // 4. 입력 필드 Wrapper (이메일 정보 텍스트와 함께 배치)
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '0', // 내부 input에서 패딩을 관리
  },
  // 5. 입력 필드 공통 스타일
  formInput: {
    flexGrow: 1,
    width: '100%',
    padding: '15px 15px', // 패딩을 넣어 이미지와 유사하게 만듭니다.
    border: 'none', // inputWrapper에 border를 줬으므로 제거
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  emailInfo: {
    fontSize: '14px',
    color: '#888',
    paddingRight: '15px',
    whiteSpace: 'nowrap', // 텍스트가 줄바꿈되지 않게
  },
  // 6. 선택 필드 (Select)
  formSelect: {
    width: '100%',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    // 이미지에서처럼 select의 기본 화살표를 제거하고 싶다면 추가적인 CSS 작업이 필요합니다.
    // 여기서는 기본 HTML/React 스타일을 유지합니다.
  },
  // 7. 제출 버튼
  submitButton: {
    width: '100%',
    padding: '15px',
    marginTop: '30px',
    backgroundColor: '#e6e6fa',
    color: '#6a5acd',
    border: '1px solid #6a5acd',
    borderRadius: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    // hover 효과는 CSS-in-JS로는 복잡하므로 외부 CSS 파일을 권장합니다.
  },
};

const CreatePage = () => {
  // 폼 제출 핸들러 (선택 사항)

  const {
    handleSubmit, // form onSubmit에 들어가는 함수
    register, // onChange 등의 이벤트 객체 생성
    watch, // register를 통해 받은 모든 값 확인
    formState: { errors }, // register의 에러 메시지 자동 출력
  } = useForm();

  // useRef, watch로 nickname 필드값 가져오고,
  // nickname.current에 값 저장
  const nickname = useRef();
  nickname.current = watch('nickname');
  // 상동.
  const email = useRef();
  email.current = watch('email');
  const job = useRef();
  job.current = watch('job');

  const onChangeFormLib = (data) => {
    console.log('제출 정보', data);
  };
  return (
    // 전체 화면 중앙 정렬을 위한 레이아웃
    <div style={styles.pageLayout}>
      <div style={styles.signupContainer}>
        <h1 style={styles.title}>회원 가입</h1>
        <form onSubmit={handleSubmit(onChangeFormLib)}>
          {/* 닉네임 입력 */}
          <div style={styles.inputGroup}>
            <label htmlFor='nickname' style={styles.inputLabel}>
              닉네임
            </label>
            <input
              type='text'
              id='nickname'
              style={styles.formInput}
              placeholder='닉네임을 입력하세요'
              // 닉네임 입력 유효성 검사. 입력하지 않으면 '닉네임을 입력해야 합니다', 최소 길이 2글자
              {...register('nickname', {
                required: { value: true, message: '닉네임을 입력해야합니다.' },
                minLength: {
                  value: 2,
                  message: '닉네임은 두 글자 이상 입력해주세요',
                },
              })}
            />
          </div>
          {/* 닉네임 에러 메시지 출력 */}
          {errors?.nickname && <span>{errors?.nickname?.message}</span>}
          {/* 이메일 입력 (읽기 전용 및 정보 텍스트 포함) */}
          <div style={styles.inputGroup}>
            <label htmlFor='email' style={styles.inputLabel}>
              이메일
            </label>
            <div style={styles.inputWrapper}>
              <input
                type='email'
                id='email'
                style={{ ...styles.formInput, borderRadius: '8px 0 0 8px' }} // wrapper에서 전체 border를 관리하므로 내부 input은 왼쪽만 둥글게
                value='user@kakao.com'
                {...register('email')}
              />
              <span style={styles.emailInfo}>(카카오에서 바로 받아옴)</span>
            </div>
          </div>

          {/* 관심 직무 선택 */}
          <div style={styles.inputGroup}>
            <label htmlFor='job' style={styles.inputLabel}>
              관심직무
            </label>
            <select
              id='job'
              style={styles.formSelect}
              {...register('job', {
                required: { value: true, message: '직무를 선택해주세요.' },
              })}
            >
              <option value='' disabled>
                직무를 선택하세요
              </option>
              <option value='developer'>개발자</option>
              <option value='designer'>디자이너</option>
              <option value='planner'>기획자</option>
            </select>
          </div>

          {/* 회원 가입 버튼 */}
          <button type='submit' style={styles.submitButton}>
            회원 가입
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreatePage;
