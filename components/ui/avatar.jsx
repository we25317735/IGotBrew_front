import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

const Avatar = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...rest}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('h-full w-full object-cover rounded-full', className)}
      {...rest}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef((props, ref) => {
  const { className, ...rest } = props
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...rest}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
