
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#873C52]">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#55102A]">
          Welcome, Admin!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your salon, services, customers and appointments.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Services", value: "0" },
          { title: "Total Customers", value: "0" },
          { title: "Total Appointments", value: "0" },
          { title: "Total Revenue", value: "৳0" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="mt-3 text-3xl font-bold text-[#55102A]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
