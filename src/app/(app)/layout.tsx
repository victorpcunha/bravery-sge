'use client'

import { Suspense } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { TabProvider } from '@/components/tabs/tab-provider'
import { TabBar } from '@/components/tabs/tab-bar'
import { TabWorkspace } from '@/components/tabs/tab-workspace'

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <TabProvider>
          <TabBar />
          <div className="relative min-h-0 flex-1">
            <Suspense fallback={null}>
              <TabWorkspace />
            </Suspense>
          </div>
        </TabProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}