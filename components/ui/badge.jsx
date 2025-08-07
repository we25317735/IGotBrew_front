import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer',
  {
    variants: {
      variant: {
        pending: 'bg-green-600   hover:bg-green-700',
        paid: 'bg-blue-600   hover:bg-blue-700',
        fail: 'bg-red-600   hover:bg-red-700',
        default: 'bg-gray-500  ',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      radius: 'full',
    },
  }
)

function Badge(props) {
  const { className, variant, radius, ...rest } = props
  return (
    <div
      className={cn(badgeVariants({ variant, radius }), className)}
      {...rest}
    />
  )
}

export { Badge, badgeVariants }
