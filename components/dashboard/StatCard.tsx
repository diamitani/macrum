
import React from 'react';
import { Card } from '../shared/Card';
// Fix: Import IconProps from ../icons to use for better type safety
// FIX: Added import for IconProps
import { IconProps } from '../icons';

interface StatCardProps {
  title: string;
  value: string | number;
  // Fix: Make icon prop more specific to React.ReactElement<IconProps>
  // FIX: Changed icon type from React.ElementType to React.ReactElement<IconProps>
  icon?: React.ReactElement<IconProps>;
  colorClassName?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClassName = 'text-primary', onClick }) => {
  return (
    <Card className={`p-2 sm:p-4 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`} onClick={onClick}>
      <div className="flex items-center">
        {/* Fix: Update React.cloneElement usage. The icon prop is now more specifically typed, so the cast is no longer needed and TypeScript can correctly infer props. This addresses the error on this line (originally line 14, referred to as 16 in error). */}
        {/* FIX: Removed cast from React.cloneElement as icon prop is now correctly typed */}
        {icon && <div className={`p-2 sm:p-3 rounded-full mr-3 sm:mr-4 ${colorClassName} bg-opacity-10`}>{React.cloneElement(icon, { className: `w-5 h-5 sm:w-6 sm:h-6 ${colorClassName}` })}</div>}
        <div>
          <p className="text-xs sm:text-sm font-medium text-neutral-dark uppercase tracking-wider">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-darkest">{value}</p>
        </div>
      </div>
    </Card>
  );
};