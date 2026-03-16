import { DashboardLayout } from "@/components/DashboardLayout";

export default function Settings_estudiante() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Settings Content</p>
            <p className="text-sm text-muted-foreground">
              This page is ready for you to customize with settings options
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
