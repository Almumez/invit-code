'use client';

import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

import { cn } from '@/lib/utils';

interface AvatarProps extends React.ComponentProps<typeof MuiAvatar> {
  className?: string;
}

const StyledAvatar = styled(MuiAvatar)(({ theme }) => ({
  width: 40,
  height: 40,
}));

const Avatar = React.forwardRef<
  HTMLDivElement,
  AvatarProps
>(({ className, ...props }, ref) => (
  <StyledAvatar
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  AvatarImageProps
>(({ className, src, alt = '', ...props }, ref) => (
  <StyledAvatar
    ref={ref}
    src={src}
    alt={alt}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  AvatarFallbackProps
>(({ className, children, ...props }, ref) => (
  <StyledAvatar
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  >
    {children}
  </StyledAvatar>
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
