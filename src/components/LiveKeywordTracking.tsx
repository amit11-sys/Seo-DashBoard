"use client";

import { getLiveKeywordData } from "@/actions/analytics";
import { useQuery } from "@tanstack/react-query";

const LiveKeywordTracking = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["keyworTracking"],
    queryFn: () => getLiveKeywordData("siding-minnesota.com"), enabled:false
  });
// console.log(data);

//   if (isLoading) return <div>Loading...</div>;
//   if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>SEO Dashboard</h1>
     <button onClick={()=>refetch()}>Fetch Keyword</button>
    </div>
  );
};

export default LiveKeywordTracking;
