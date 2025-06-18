'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/lib'
import { usePathname, useRouter } from 'next/navigation'
import { axiosFetch, clearAuthToken } from '@/utils/axios'

export default function AdminDashboard({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [isResizing, setIsResizing] = useState(false)
  const pathname = usePathname()
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)
  const router = useRouter()

  const startResize = () => {
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = e.clientX
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth)
    }
  }

  const stopResize = () => {
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', stopResize)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResize)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [isResizing])

  // Handle responsive collapse
  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }
    window.addEventListener('resize', resizeHandler)
    resizeHandler()
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? '-translate-x-full lg:translate-x-0 lg:w-16'
            : 'w-64'
        }`}
        style={!sidebarCollapsed ? { width: sidebarWidth } : {}}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <div className="space-y-1">
            <h3
              className={`px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                sidebarCollapsed ? 'lg:opacity-0' : 'opacity-100'
              }`}
            >
              Data Management
            </h3>
            <Link
              href="/admin/dashboard"
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg  ',
                pathname === '/admin/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-black'
              )}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z..." />
              </svg>
              <span
                className={`${
                  sidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'
                }`}
              >
                Dashboard
              </span>
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => {
                clearAuthToken()
                router.push('/login')
              }}
              className="group w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut />
              <span
                className={`${
                  sidebarCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </nav>

        {!sidebarCollapsed && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-500 cursor-col-resize"
            onMouseDown={startResize}
          ></div>
        )}
      </div>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out min-h-screen w-full ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
        style={!sidebarCollapsed ? { marginLeft: sidebarWidth } : {}}
      >
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 bg-transparent shadow-sm"
            >
              <Menu />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0..." />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0..." />
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
