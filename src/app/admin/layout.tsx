import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* AdminHeader will be rendered by individual pages if needed for title/subtitle */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

