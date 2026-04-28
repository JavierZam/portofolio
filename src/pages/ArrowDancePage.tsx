import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ArrowDance from '../components/games/ArrowDance'

export default function ArrowDancePage() {
  return (
    <div className="noise animated-gradient min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={16} /> Back to Games
        </Link>

        <ArrowDance />
      </div>
    </div>
  )
}
