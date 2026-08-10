import * as React from "react";
import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'glow' | 'accent';
    hover?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export declare function Card({ children, className, variant, hover, onClick }: CardProps): import("react/jsx-runtime").JSX.Element;
export declare function CardHeader({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function CardContent({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function CardFooter({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=card.d.ts.map