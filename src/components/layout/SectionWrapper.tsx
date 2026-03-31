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
      className={`relative w-full ${fullHeight ? 'min-h-screen' : ''} px-4 md:px-8 lg:px-16 py-16 md:py-24 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}
