export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className="max-w-md mx-auto mt-10 p-6 border rounded">{children}</section>
  }