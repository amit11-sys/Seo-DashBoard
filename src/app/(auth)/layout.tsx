export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return <main className="w-full grid  grid-cols-2 place-content-center min-h-screen ">
  return (
    <main className="w-full min-h-screen ">
   

      {/* <section className="w-full flex justify-center items-center"> */}
      <div className="">{children}</div>

      {/* </section> */}
    </main>
  );
}
