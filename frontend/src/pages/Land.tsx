import { Map } from 'lucide-react'
import EmptyState from '../components/shared/EmptyState'

export default function Land() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <Map size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">Land Analysis</h1>
      </div>
      <div className="card-base min-h-[400px] flex items-center justify-center">
        <EmptyState 
          icon={Map}
          title="No Field Data"
          description="Map your field boundaries to get soil health and topography insights."
          actionLabel="Map Field"
          onAction={() => {}}
        />
      </div>
    </div>
  )
}
