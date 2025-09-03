import { ClassValue } from 'clsx';

export function H2({ children, className }: { children: React.ReactNode; className?: ClassValue }) {
  return <h2 className={`scroll-m-20 text-primary text-3xl md:text-4xl font-semibold tracking-tight ${className}`}>{children}</h2>;
}