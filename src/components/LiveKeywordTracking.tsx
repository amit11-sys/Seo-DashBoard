"use client";

import { getLiveKeywordData } from "@/actions/analytics";
import { useQuery } from "@tanstack/react-query";

const LiveKeywordTracking = () => {
  const {refetch } = useQuery({
    queryKey: ["keyworTracking"],
    queryFn: () => getLiveKeywordData("siding-minnesota.com"), enabled:false
  });

  return (
    <div>
      <h1>SEO Dashboard</h1>
     <button onClick={()=>refetch()}>Fetch Keyword</button>
    </div>
  );
};

export default LiveKeywordTracking;
