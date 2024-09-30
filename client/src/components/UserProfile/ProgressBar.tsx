import styled from 'styled-components';
import { Progress } from 'antd';

interface ProgressBarProps {
  levelProgress: number;
}

const ProgressBar = ({ levelProgress }: ProgressBarProps) => {
  return (
    <ProgressBarStyle>
      <Progress
        percent={levelProgress}
        size={['100%', 25]}
        strokeColor="#0ACF83"
        trailColor="#E2F8F1"
      />
    </ProgressBarStyle>
  );
};

const ProgressBarStyle = styled.div`
  width: 100%;
`;

export default ProgressBar;
