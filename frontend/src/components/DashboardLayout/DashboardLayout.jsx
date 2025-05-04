// import { MainNav } from "@/components/main-nav"

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-orange-50 dark:bg-gray-900">
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
