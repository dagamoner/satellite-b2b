import * as React from "react";
import { HTMLMotionProps } from "framer-motion";
import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'premium' | 'glow';
    size?: 'default' | 'sm' | 'lg' | 'xl';
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=button.d.ts.map