import styled from 'styled-components';

const Test = () => {
  return <TestStyle></TestStyle>;
};

const TestStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

export default Test;
