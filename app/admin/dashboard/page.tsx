import Navbar from "@/components/Navbar";
import { CalendarDays, Users, CreditCard, TrendingUp } from "lucide-react";
import Image from "next/image";
import bgImage from "@/public/images/sea bg9.jpg";
import { Inter } from "next/font/google";
import UniqueVisitorCard from "@/components/UniqueVisitorCard";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default function DashboardPage() {
  // Example stats data – replace with real data from your booking management
  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: CalendarDays,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: "$45,678",
      icon: CreditCard,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Active Users",
      value: "890",
      icon: Users,
      change: "+5%",
      changeType: "positive",
    },
    {
      title: "Upcoming Bookings",
      value: "67",
      icon: TrendingUp,
      change: "-2%",
      changeType: "negative",
    },
  ];

  return (
    <div className={`relative min-h-screen ${inter.className}`}>
      {/* Background Image using Next.js Image component */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pt-32">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Analytics and booking overview.</p>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white overflow-hidden shadow rounded-3xl px-4 py-5 sm:p-6"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <stat.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder for charts / additional widgets */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-3xl p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Chart or list goes here.
              </p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-3xl p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Top Services
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Chart or list goes here.
              </p>
            </div>
          </div>

          {/* ── Website Analytics ── */}
          <section aria-labelledby="analytics-heading" className="mt-10">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-600 font-bold mb-2" id="analytics-heading">
              Website Analytics
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Visitor Statistics
            </h2>
            <UniqueVisitorCard />
          </section>
        </div>
      </div>
    </div>
  );
}
