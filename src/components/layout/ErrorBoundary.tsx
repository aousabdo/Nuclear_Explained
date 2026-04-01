import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  sectionId?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary] Section "${this.props.sectionId}" threw:`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="relative w-full py-24 px-4">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-text-primary">Section failed to load</h2>
            <p className="text-sm text-text-muted">
              Something went wrong in this section. The rest of the site is unaffected.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-white/20 transition-all"
            >
              Try again
            </button>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
