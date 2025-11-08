import { ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-8 sm:px-8', className)}>
      {(title || description) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
