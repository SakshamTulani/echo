import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { Provider } from "jotai";

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("sidebar_state")?.value;
  const defaultOpen = cookieValue ? cookieValue === "true" : true;

  return (
    <AuthGuard>
      <Provider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <SidebarInset>
            {/* Mobile header with sidebar trigger */}
            <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
              <SidebarTrigger />
            </header>
            <main className="flex flex-1 flex-col">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </Provider>
    </AuthGuard>
  );
}
