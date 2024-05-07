import styled from 'styled-components';
import { Progress } from 'antd';

interface ProgressBarProps {
  point: number;
}

const calcProgressPercent = (point: number) => Math.floor(((point % 1024) / 1024) * 100);

const ProgressBar = ({ point }: ProgressBarProps) => {
  return (
    <ProgressBarStyle>
      <Progress
        percent={calcProgressPercent(point)}
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
