import * as React from 'react';
import { default as MuiCard } from '@mui/material/Card';
import { default as MuiCardContent } from '@mui/material/CardContent';
import { default as MuiCardHeader } from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { cn } from "@/lib/utils"

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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "materio-card rounded-lg border border-dashboard-border bg-white text-dashboard-text shadow-soft",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-dashboard-text leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-dashboard-text-muted", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
