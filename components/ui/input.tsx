import * as React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.5rem',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.6)',
    '&.Mui-focused': {
      color: '#000',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
  },
  '& .MuiInputBase-input.MuiInputBase-inputSizeSmall': {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
  },
}));

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ fullWidth = true, size = 'medium', ...props }, ref) => {
    return (
      <StyledTextField
        variant="outlined"
        inputRef={ref}
        fullWidth={fullWidth}
        size={size}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
