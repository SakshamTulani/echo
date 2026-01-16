import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import {
  SIDEBAR_COOKIE_NAME,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value;
  const defaultOpen = cookieValue ? cookieValue === "true" : true;

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarProvider>
    </AuthGuard>
  );
}
