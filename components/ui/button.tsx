import * as React from 'react';
import { default as MuiButton } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';

interface ButtonProps extends MuiButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: '0.5rem',
  textTransform: 'none',
  fontWeight: 500,
  '&.MuiButton-contained': {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#333',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#000',
    color: '#000',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  '&.MuiButton-text': {
    color: '#000',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
  '&.MuiButton-sizeSmall': {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
  '&.MuiButton-sizeMedium': {
    padding: '0.625rem 1.25rem',
    fontSize: '1rem',
  },
  '&.MuiButton-sizeLarge': {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
  },
}));

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'contained', size = 'medium', fullWidth = false, children, className, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={className}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
