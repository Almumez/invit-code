'use client';

import * as React from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { cn } from '@/lib/utils';

const StyledFormControl = styled(FormControl)({
  minWidth: 120,
  width: '100%',
});

// Main Select component
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onChange, placeholder, className, children, ...props }, ref) => {
    const handleChange = (event: SelectChangeEvent<unknown>) => {
      onChange(event.target.value as string);
    };

    return (
      <StyledFormControl className={className} ref={ref}>
        {placeholder && <InputLabel>{placeholder}</InputLabel>}
        <MuiSelect
          value={value}
          label={placeholder}
          onChange={handleChange}
          {...props}
        >
          {children}
        </MuiSelect>
      </StyledFormControl>
    );
  }
);
Select.displayName = 'Select';

// SelectItem component
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectItem = ({ value, children, className }: SelectItemProps) => {
  return <MenuItem value={value} className={className}>{children}</MenuItem>;
};
SelectItem.displayName = 'SelectItem';

// Export both components
export { Select, SelectItem };
