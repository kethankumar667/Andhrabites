import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const LinkComponent: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  external = false,
}) => {
  const classes = clsx(
    'text-primary-green hover:text-primary-green/90 font-medium transition-colors duration-200',
    className
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
};

export const Link = LinkComponent;