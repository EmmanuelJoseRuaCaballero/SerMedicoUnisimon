import { DashboardLayout } from "@/components/DashboardLayout";

export default function Evaluations() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Evaluations</h1>
          <p className="text-muted-foreground mt-2">
            Review your evaluations and feedback
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-border min-h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Evaluations Content</p>
            <p className="text-sm text-muted-foreground">
              This page is ready for you to customize with evaluation data
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
