import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(({ children, className, fullWidth = false, ...props }, ref) => {
    return (
        <section ref={ref} className={cn("relative py-16 md:py-24 overflow-hidden", className)} {...props}>
            <div className={cn("mx-auto px-4 md:px-6", fullWidth ? "max-w-none px-0" : "container")}>
                {children}
            </div>
        </section>
    );
});

Section.displayName = "Section";
