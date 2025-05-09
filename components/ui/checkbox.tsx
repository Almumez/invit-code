'use client';

import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.ComponentProps<typeof MuiCheckbox>, 'onChange'> {
  className?: string;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  padding: theme.spacing(0.5),
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&.MuiCheckbox-root': {
    color: theme.palette.text.primary,
  },
}));

const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ className, label, onCheckedChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  const checkbox = (
    <StyledCheckbox
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );

  if (label) {
    return <FormControlLabel control={checkbox} label={label} />;
  }

  return checkbox;
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
