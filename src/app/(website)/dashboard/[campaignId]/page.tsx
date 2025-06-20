export default async function DashboardDetails({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params
  return <div>My Post: {campaignId}</div>
}