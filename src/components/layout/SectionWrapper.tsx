import type { ReactNode } from 'react'
import { useScrollSection } from '../../hooks/useScrollSection'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  fullHeight?: boolean
}

export function SectionWrapper({ id, children, className = '', fullHeight = true }: SectionWrapperProps) {
  const { ref } = useScrollSection(id)

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full ${fullHeight ? 'min-h-screen' : ''} py-16 md:py-24 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
        {children}
      </div>
    </section>
  )
}
