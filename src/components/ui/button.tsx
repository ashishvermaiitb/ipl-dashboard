import { ReactNode, ButtonHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
        outline:
          "border border-gray-400 bg-transparent hover:bg-gray-50 text-gray-900 focus-visible:ring-gray-600 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
        ghost:
          "hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
        link: "text-blue-600 hover:underline focus-visible:ring-blue-500 p-0 h-auto dark:text-blue-400",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button = ({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, buttonVariants };
