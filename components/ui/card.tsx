import * as React from 'react';
import { default as MuiCard } from '@mui/material/Card';
import { default as MuiCardContent } from '@mui/material/CardContent';
import { default as MuiCardHeader } from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: '0.75rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: '1.25rem 1.5rem',
  '& .MuiCardHeader-title': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#000',
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: 'rgba(0, 0, 0, 0.6)',
  },
}));

const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: '1.5rem',
}));

const StyledCardFooter = styled(CardActions)(({ theme }) => ({
  padding: '1rem 1.5rem',
  justifyContent: 'flex-end',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
}));

// Components
const Card = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof StyledCard>
>((props, ref) => <StyledCard ref={ref} {...props} />);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof StyledCardHeader>
>((props, ref) => <StyledCardHeader ref={ref} {...props} />);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Typography>
>(({ className, ...props }, ref) => (
  <Typography variant="h5" component="h3" ref={ref} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Typography>
>(({ className, ...props }, ref) => (
  <Typography variant="body2" color="text.secondary" ref={ref} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof StyledCardContent>
>((props, ref) => <StyledCardContent ref={ref} {...props} />);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof StyledCardFooter>
>((props, ref) => <StyledCardFooter ref={ref} {...props} />);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
