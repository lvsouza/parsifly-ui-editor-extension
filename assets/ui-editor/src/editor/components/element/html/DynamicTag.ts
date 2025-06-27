import { type DetailedHTMLProps, createElement, forwardRef } from 'react';

export const DynamicTag = forwardRef<{}, DetailedHTMLProps<React.AllHTMLAttributes<HTMLElement>, HTMLElement> & { tag: string }>(({ tag, ...props }, ref) => {
  return createElement(tag, { ref, ...props });
});
