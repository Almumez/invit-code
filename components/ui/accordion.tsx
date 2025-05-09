'use client';

import * as React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

import { cn } from '@/lib/utils';

interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children?: React.ReactNode;
}

const StyledAccordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.Mui-expanded': {
    minHeight: 48,
  },
}));

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Accordion = ({ className, children, ...props }: AccordionProps) => {
  return <div className={cn(className)} {...props}>{children}</div>;
};

interface AccordionItemProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ className, children, value, defaultExpanded = false, ...props }, ref) => (
  <StyledAccordion 
    ref={ref}
    className={cn(className)}
    disableGutters
    defaultExpanded={defaultExpanded}
    {...props}
  >
    {children}
  </StyledAccordion>
));
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  HTMLDivElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <StyledAccordionSummary
    ref={ref}
    expandIcon={<ExpandMoreIcon />}
    className={cn(
      'flex-1 font-medium transition-all',
      className
    )}
    {...props}
  >
    {children}
  </StyledAccordionSummary>
));
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps {
  className?: string;
  children?: React.ReactNode;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <StyledAccordionDetails
    ref={ref}
    className={cn('text-sm', className)}
    {...props}
  >
    {children}
  </StyledAccordionDetails>
));

AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
