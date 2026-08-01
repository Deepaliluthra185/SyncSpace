import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function Icon({ name, i, className, size, color }: any) {
  const iconName = name || i || 'circle';
  // Convert dash-case to PascalCase for lucide icons, e.g. 'play-circle' -> 'PlayCircle'
  const pascalName = iconName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const LucideIcon = (LucideIcons as any)[pascalName];
  if (!LucideIcon) {
    console.warn(`Icon ${name} not found in lucide-react`);
    const FallbackIcon = LucideIcons.Circle;
    return <FallbackIcon className={className} size={size} color={color} />;
  }
  
  return <LucideIcon className={className} size={size} color={color} />;
}
