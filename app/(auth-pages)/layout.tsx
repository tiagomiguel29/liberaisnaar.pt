export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full sm:w-[550px] flex flex-col gap-12 items-center px-4 py-16">{children}</div>
  );
}
