export default function CampaignTable({ data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Campaign Name</th>
            <th className="p-2">Date Added</th>
            <th className="p-2">Integration</th>
            <th className="p-2">Searcher</th>
            <th className="p-2">Audit Score</th>
            <th className="p-2">Kwds</th>
            <th className="p-2">Top 3</th>
            <th className="p-2">Top 10</th>
            <th className="p-2">Top 20</th>
            <th className="p-2">Top 100</th>
            <th className="p-2">Backlinks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((camp:{name:string,date:string,integration:string,searcher:string,audit:string,kwds:string,top3:string,top10:string,top20:string,top100:string,backlinks:string}) => (
            <tr key={camp.name} className="border-t">
              <td className="p-2">{camp.name}</td>
              <td className="p-2">{camp.date}</td>
              <td className="p-2">{camp.integration}</td>
              <td className="p-2">{camp.searcher}</td>
              <td className="p-2">{camp.audit}</td>
              <td className="p-2">{camp.kwds}</td>
              <td className="p-2">{camp.top3}</td>
              <td className="p-2">{camp.top10}</td>
              <td className="p-2">{camp.top20}</td>
              <td className="p-2">{camp.top100}</td>
              <td className="p-2">{camp.backlinks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
