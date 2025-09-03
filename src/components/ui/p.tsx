import { ClassValue } from 'clsx';

export function P({ children, className }: { children: React.ReactNode; className?: ClassValue }) {
  return <p className={`scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight ${className}`}>{children}</p>;
}