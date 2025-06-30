export default async function DashboardDetails({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params
  return <div className="mt-28">My Post: {campaignId}</div>
}