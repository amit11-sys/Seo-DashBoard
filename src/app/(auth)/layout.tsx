export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full  flex  justify-center items-center  min-h-screen ">
      <section
        className=" flex-1 h-screen w-full bg-center bg-cover"
        style={{ backgroundImage: "url('/images/forms-bg.jpg')" }}
      ></section>

      <div className=" flex-1">{children}</div>

      
    </main>
  );
}
