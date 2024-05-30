import styled from 'styled-components';
import { useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

const CreateMainQuestButton = () => {
  const navigate = useNavigate();

  return (
    <CreateMainQuestButtonStyle>
      <button onClick={() => navigate('/createquest')} className="createBtn">
        <GrAddCircle />
      </button>
    </CreateMainQuestButtonStyle>
  );
};

const CreateMainQuestButtonStyle = styled.div`
  padding-top: 0.2rem;

  .createBtn {
    background: none;
    cursor: pointer;
  }
`;

export default CreateMainQuestButton;
