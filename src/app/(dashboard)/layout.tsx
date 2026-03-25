import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* pt-18 on mobile to account for the fixed mobile top bar (h-14 + padding) */}
        <div className="p-4 pt-18 md:p-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
