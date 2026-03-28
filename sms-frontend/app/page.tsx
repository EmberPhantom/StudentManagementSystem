import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-8 p-8">
      <section className="rounded-xl border border-slate-300 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Management System</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          A lightweight school management dashboard with role-based access (admin, teacher, student), secure JWT auth.
          Use login/register to get started.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Login
          </Link>
          <Link href="/register" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Register
          </Link>
          <Link href="/dashboard" className="rounded-md border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/20">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Admin", description: "Admin controls and user management", to: "/admin" },
          { title: "Teacher", description: "Attendance, class and course management", to: "/teacher" },
          { title: "Student", description: "View academic progress and attendance", to: "/student" },
        ].map((card) => (
          <Link key={card.title} href={card.to} className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">{card.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
