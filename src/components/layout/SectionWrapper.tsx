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
      className={`relative w-full ${fullHeight ? 'min-h-screen' : ''} px-6 md:px-12 lg:px-20 xl:px-24 py-16 md:py-24 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}
