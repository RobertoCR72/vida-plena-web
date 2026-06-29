import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-colors disabled:opacity-50'
    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700',
      outline: 'border border-gray-300 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100',
    }
    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
