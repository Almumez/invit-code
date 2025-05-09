'use client';

import * as React from 'react';
import MuiFormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const StyledFormLabel = styled(MuiFormLabel)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 'normal',
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
}));

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof MuiFormLabel> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <StyledFormLabel
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
