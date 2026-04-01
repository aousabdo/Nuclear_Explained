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
      style={{ touchAction: 'pan-y' }}
      className={`relative w-full ${fullHeight ? 'min-h-screen' : ''} pt-24 pb-12 md:pt-24 md:pb-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-10 lg:px-12">
        {children}
      </div>
    </section>
  )
}
