import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="text-6xl mb-6">☢️</span>
        <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          This page doesn't exist — but the nuclear threat does.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-blast/20 text-blast border border-blast/30 hover:bg-blast/30 transition-all font-semibold"
        >
          Go Home
        </Link>
      </div>
    </PageTransition>
  )
}
