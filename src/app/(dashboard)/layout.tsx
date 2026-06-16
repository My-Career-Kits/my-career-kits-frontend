import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DashboardFooter from "@/components/layout/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-6">
              {children}
            </div>
            <DashboardFooter />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}