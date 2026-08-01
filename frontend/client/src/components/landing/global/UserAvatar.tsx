import React from 'react';

export default function UserAvatar({ src, gender, heritage, index, className, style }: any) {
  // Use dicebear if src is not provided
  const avatarSrc = src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index || Math.random()}`;
  return (
    <img 
      src={avatarSrc} 
      className={className} 
      style={{ objectFit: 'cover', ...style }} 
      alt="User avatar" 
    />
  );
}
