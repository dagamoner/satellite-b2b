"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.Card = Card;
exports.CardHeader = CardHeader;
exports.CardContent = CardContent;
exports.CardFooter = CardFooter;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function Card({ children, className, variant = 'default', hover = true }) {
    const baseStyles = "relative overflow-hidden rounded-[2rem] border transition-all duration-500";
    const variants = {
        default: "bg-slate-900/50 border-white/10",
        glass: "bg-slate-950/40 backdrop-blur-xl border-white/10",
        glow: "bg-slate-900/50 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]",
        accent: "bg-gradient-to-br from-slate-900 to-slate-950 border-cyan-500/30",
    };
    const hoverStyles = hover ? "hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:-translate-y-1" : "";
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: cn(baseStyles, variants[variant], hoverStyles, className), children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10", children: children })] }));
}
function CardHeader({ children, className }) {
    return (0, jsx_runtime_1.jsx)("div", { className: cn("p-6 pb-2", className), children: children });
}
function CardContent({ children, className }) {
    return (0, jsx_runtime_1.jsx)("div", { className: cn("p-6 pt-2", className), children: children });
}
function CardFooter({ children, className }) {
    return (0, jsx_runtime_1.jsx)("div", { className: cn("p-6 pt-0 flex items-center", className), children: children });
}
