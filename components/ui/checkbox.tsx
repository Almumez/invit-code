'use client';

import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CheckboxProps {
  className?: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ className, label, checked, onCheckedChange, disabled, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  // استخدام MUI Checkbox مباشرة مع props المناسبة
  const checkbox = (
    <MuiCheckbox
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        '&.MuiCheckbox-root': {
          color: '#94A3B8',
        },
        '&.Mui-checked': {
          color: '#1E40AF !important', // أزرق داكن
        },
        '&.Mui-checked .MuiSvgIcon-root': {
          color: '#1E40AF !important', // للتأكيد على تطبيق اللون
        },
        '&:hover': {
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
        },
      }}
      className={className}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel 
        control={checkbox} 
        label={label}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
          }
        }}
      />
    );
  }

  return checkbox;
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
