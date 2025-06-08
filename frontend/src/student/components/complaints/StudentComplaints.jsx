import StudentComplaintCard from "@/components/student-complaint-card/StudentComplaintCard"

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-orange-700 dark:text-orange-400">Submit Complaint</h1>
        <p className="text-muted-foreground">
          Have a concern or issue? Let us know and we'll work to resolve it promptly.
        </p>
      </div>
      <StudentComplaintCard />
    </div>
  )
}
