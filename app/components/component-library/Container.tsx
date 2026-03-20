'use client';

import styled from '@emotion/styled';

/**
 * Container component — a flexbox layout wrapper.
 *
 * Props:
 *   - column: boolean — if true, sets flex-direction to column; otherwise, row.
 *
 * Usage:
 *   <Container column={true}>...</Container>
 *
 * Uses Emotion's styled API for styling.
 */

type ContainerProps = {
  column?: boolean;
  gap?: number;
};

const Container = styled('div')<ContainerProps>(({ column, gap }) => ({
  display: 'flex',
  flexDirection: column ? 'column' : 'row',
  gap: gap ? `${gap}px` : '0',
}));

export default Container;
