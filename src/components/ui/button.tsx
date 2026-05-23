import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Professional dashboard button
 * - clean shadcn-style variants
 * - consistent focus ring
 * - loading state with spinner + disables
 * - optional left/right icon
 */

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors transition-shadow',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
        warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

type IconPlacement = 'left' | 'right';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ElementType;
  iconPlacement?: IconPlacement;
  spinnerText?: string; // optional label when loading
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      icon: Icon,
      iconPlacement = 'left',
      spinnerText,
      children,
      type,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Keep type stable; if asChild, type is ignored by Slot anyway
    const resolvedType = type ?? 'button';

    const showSpinner = loading;
    const LeftIcon = iconPlacement === 'left' ? Icon : undefined;
    const RightIcon = iconPlacement === 'right' ? Icon : undefined;

    return (
      <Comp
        ref={ref}
        type={!asChild ? resolvedType : undefined}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {showSpinner ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {spinnerText ? <span>{spinnerText}</span> : children}
          </>
        ) : (
          <>
            {LeftIcon ? <LeftIcon className="h-4 w-4" /> : null}
            <span className="inline-flex items-center">{children}</span>
            {RightIcon ? <RightIcon className="h-4 w-4" /> : null}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };