import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'rounded-full font-medium transition-colors duration-300 flex items-center justify-center';
  const variantStyles = {
    primary: 'bg-black hover:bg-gray-900 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-black'
  };
  const sizeStyles = {
    sm: 'text-sm py-1 px-3',
    md: 'py-2 px-5',
    lg: 'text-lg py-3 px-8'
  };
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}>
      {children}
    </button>;
};
export default Button;