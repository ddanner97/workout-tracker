import React from 'react';

import { IconDisplay, Container } from '../components/component-library';
import BoltIcon from '@mui/icons-material/Bolt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';

const FEATURES = [
  {
    icon: <BoltIcon />,
    description: ['Log Fast'],
  },
  {
    icon: <TuneIcon />,
    description: ['Adjust', 'Instantly'],
  },
  {
    icon: <ShowChartIcon />,
    description: ['Track', 'Progress'],
  },
  {
    icon: <CheckIcon />,
    description: ['Stay', 'Consistent'],
  },
];

const HeaderElement = ({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) => {
  return (
    <h1
      className="font-serif text-[42px] font-semibold tracking-[-0.5px] md:text-[78px] lg:text-[102px]"
      style={style}
    >
      {text}
    </h1>
  );
};

export default function LoginContent() {
  return (
    <Container column gap={10} className="flex-col justify-center">
      {/* tagline */}
      <Container column>
        <HeaderElement text="Built for" />
        <Container gap={6}>
          <HeaderElement text="the" />
          <HeaderElement
            style={{ color: 'var(--color-accent)' }}
            text="Moment."
          />
        </Container>
      </Container>

      {/* divider */}
      <Container column gap={6}>
        <p className="text-[22px]" style={{ color: 'var(--color-muted)' }}>
          Flexible logging. Real progress.
        </p>
        <div
          style={{
            width: '20%',
            height: '2px',
            backgroundColor: 'var(--color-badge-bg)',
            borderRadius: '1px',
          }}
        />
        <p style={{ width: '60%' }}>
          Log workouts quickly, adjust on the fly, and track your progress
          without the clutter.
        </p>
      </Container>

      {/* features */}
      <Container className="max-w-[300px] justify-between">
        {FEATURES.map(({ icon, description }, index) => {
          return (
            <Container column key={index}>
              <IconDisplay icon={icon} />
              {description.map((line, index) => {
                return (
                  <p
                    className="text-center text-[10px] font-semibold"
                    key={index}
                  >
                    {line}
                  </p>
                );
              })}
            </Container>
          );
        })}
      </Container>
    </Container>
  );
}
