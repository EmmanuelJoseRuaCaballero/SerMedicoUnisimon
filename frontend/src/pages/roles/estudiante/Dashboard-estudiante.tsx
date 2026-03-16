import { DashboardLayout } from "@/components/DashboardLayout";

export default function Dashboard_estudiante() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical portfolio and academic progress
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large content area - spans 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 rounded-lg bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">Icon</span>
                </div>
                <p className="text-lg font-semibold text-foreground">Main Content Area</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Your main dashboard content will appear here
                </p>
              </div>
            </div>
          </div>

          {/* Side card */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
            <div className="text-center w-full">
              <div className="h-20 w-20 rounded-lg bg-muted mx-auto mb-4 flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">Stats</span>
              </div>
              <p className="text-lg font-semibold text-foreground">Quick Stats</p>
              <p className="text-sm text-muted-foreground mt-2">
                Summary information will appear here
              </p>
            </div>
          </div>
        </div>

        {/* Secondary content area */}
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="min-h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">List</span>
              </div>
              <p className="text-sm text-muted-foreground">Your recent activities will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
