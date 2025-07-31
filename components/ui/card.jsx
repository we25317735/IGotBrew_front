import React from 'react'
import { cn } from '@/lib/utils'

export function Card({ children, ...rest }) {
  return (
    <div className="rounded border bg-light text-body shadow-sm" {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ children, ...rest }) {
  return <div className="d-flex flex-column gap-2 p-4">{children}</div>
}

export function CardTitle({ className, children, ...rest }) {
  return <div className="fs-4 fw-semibold lh-1">{children}</div>
}

export function CardDescription({ className, children, ...rest }) {
  return <div className="small text-muted">{children}</div>
}

export function CardContent({ className, children, ...rest }) {
  return <div className="p-4 pt-0">{children}</div>
}

export function CardFooter({ className = '', children, ...rest }) {
  return (
    <div
      className={`fs-1 d-flex align-items-center p-4 pt-0 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
