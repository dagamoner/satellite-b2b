"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
exports.cn = cn;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
exports.Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    const variants = {
        default: "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500",
        outline: "border-2 border-slate-700 bg-transparent hover:border-cyan-500/50 hover:bg-slate-900/50 text-white",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-white/5",
        ghost: "hover:bg-slate-900/50 hover:text-cyan-400 text-slate-400",
        premium: "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-600 border border-white/10",
        glow: "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:bg-cyan-400",
    };
    const sizes = {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-[1.25rem] px-10 text-base",
        xl: "h-16 rounded-3xl px-12 text-lg font-black uppercase tracking-wider",
    };
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { ref: ref, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: cn(baseStyles, variants[variant], sizes[size], className), ...props }));
});
exports.Button.displayName = "Button";
