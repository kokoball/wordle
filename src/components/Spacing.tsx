import { HTMLAttributes, memo } from 'react';

interface SpacingProps extends HTMLAttributes<HTMLDivElement> {
  children?: never;
  direction?: 'horizontal' | 'vertical';
  size: number;
}

const Spacing = memo(function Spacing({
  direction = 'vertical',
  size,
  ...props
}: SpacingProps) {
  return (
    <div
      style={{
        flex: 'none',
        width: direction === 'horizontal' ? `${size}px` : undefined,
        height: direction === 'vertical' ? `${size}px` : undefined,
      }}
      {...props}
    />
  );
});

export default Spacing;
