import axiosInstance from '@api/axios';
import { PageContainer } from '@components/layout/PageContainer';
import React, { useEffect, useState } from 'react';

const SimulationStart = () => {
  const [mode, setMode] = useState('일대일'); // Interview Mode
  const [order, setOrder] = useState('N'); // Question Order
  const [questionSets, setQuestionSets] = useState([]); // Question Set
  const [questionSet, setQuestionSet] = useState(''); // Question Set
  const [questionTag, setQuestionTag] = useState([]); // Question Set
  const [interviewer, setInterviewer] = useState(''); // Interview Room
  const [interviewers, setInterviewers] = useState([]); // Interview Room

  const handleModeChange = (event) => setMode(event.target.value);
  const handleOrderChange = (event) => setOrder(event.target.value);
  const handleQuestionSetChange = (event) => {
    setQuestionSet(event.target.value);
    setQuestionTag(
      questionSets.filter((qu) => {
        return qu.postId == event.target.value;
      }),
    );
  };
  const handleRoomChange = (event) => {
    setInterviewer(event.target.value);
    console.log(questionTag);
  };

  useEffect(() => {
    axiosInstance
      .get('/interviewers')
      .then((resp) => {
        setInterviewers(resp.data.data);
      })
      .catch();
    axiosInstance
      .get('/simulation')
      .then((resp) => {
        setQuestionSets(resp.data.data);
      })
      .catch();
  }, []);

  const handleStartClick = () => {
    axiosInstance
      .post('/simulation', {
        simulationRandom: order,
        post: { postId: questionSet },
        interviewer: { interviewerId: interviewer },
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch();
  };

  return (
    <PageContainer header footer>
      <div style={{ padding: '20px' }}>
        <div>
          <label>
            <input
              type='radio'
              value='일대일'
              checked={mode === '일대일'}
              onChange={handleModeChange}
            />
            일대일
          </label>
          <label>
            <input
              type='radio'
              value='다대다'
              checked={mode === '다대다'}
              onChange={handleModeChange}
              disabled
            />
            다대다
          </label>
        </div>

        <div>
          <label>
            <input type='radio' value='N' checked={order === 'N'} onChange={handleOrderChange} />
            순차적으로
          </label>
          <label>
            <input type='radio' value='Y' checked={order === 'Y'} onChange={handleOrderChange} />
            랜덤
          </label>
        </div>

        <div>
          <h4>질문답변 세트 선택</h4>
          <select value={questionSet} onChange={handleQuestionSetChange}>
            {questionSets.map((qSet, inx) => {
              return (
                <option value={qSet.postId} key={inx}>
                  {qSet.title}
                </option>
              );
            })}
          </select>
          <div>
            {questionTag.map((qu, index) => {
              return <div key={index}>{qu.job}</div>;
            })}
          </div>
        </div>

        <div>
          <h4>면접관 선택</h4>
          <select value={interviewer} onChange={handleRoomChange}>
            {interviewers.map((viewr, inx) => {
              return (
                <option value={viewr.interviewerId} key={inx}>
                  {viewr.interviewerCharacterDesc}
                </option>
              );
            })}
          </select>
        </div>

        <button
          style={{
            backgroundColor: '#7F56D9',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
          }}
          onClick={handleStartClick}
        >
          시작하기
        </button>
      </div>
    </PageContainer>
  );
};

export default SimulationStart;
