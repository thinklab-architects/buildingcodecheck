import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Glass Card Container
export const GlassCard = ({ children, className = '' }) => (
    <div className={`glass-card ${className}`}>
        {children}
    </div>
);

// Card Header with Icon
export const CardHeader = ({ icon: Icon, title, children }) => (
    <div className="card-header">
        <div className="card-title">
            {Icon && <Icon size={18} className="text-sky-600" />}
            {title}
        </div>
        {children}
    </div>
);

// Input Group Wrapper
export const InputGroup = ({ label, children, subLabel }) => (
    <div className="input-group">
        <div className="input-label">
            {label}
            {subLabel && <span className="text-xs text-slate-400 ml-2 font-normal">{subLabel}</span>}
        </div>
        {children}
    </div>
);

// Styled Text/Number Input
export const TechInput = ({ type = "text", value, onChange, placeholder, unit, ...props }) => (
    <div className="relative">
        <input
            type={type}
            className="input-dark w-full"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
        {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                {unit}
            </span>
        )}
    </div>
);

// Checkbox with Tech Style
export const TechCheckbox = ({ label, checked, onChange }) => (
    <label className="tech-checkbox">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
    </label>
);

// Status Icon (Pass/Fail)
export const StatusIcon = ({ ok }) => (
    ok ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />
);

// Status Banner
export const StatusBanner = ({ isCompliant, title, subtitle }) => (
    <div className={`status-banner ${isCompliant ? 'pass' : 'fail'}`}>
        <div className="flex justify-center mb-4">
            {isCompliant ? (
                <CheckCircle className="w-16 h-16" />
            ) : (
                <XCircle className="w-16 h-16" />
            )}
        </div>
        <h2 className="text-3xl font-bold mb-2">
            {isCompliant ? '檢核通過' : '檢核未通過'}
        </h2>
        <p className="opacity-90 text-lg font-medium">
            {title}
        </p>
        {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
    </div>
);
