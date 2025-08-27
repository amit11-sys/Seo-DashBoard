"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import GoogleMap from "./GoogleMap";

interface Keyword {
  keyword: string;
  rank: number | null;
  searchVolume: string | null;
}

interface BusinessScanProps {
  name?: string;
  address?: string;
  reviews?: number;
  stars?: number;
  keywords?: Keyword[];
  mapUrl?: string; // Google Maps iframe src
}

export default function KeywordtrackingGmb({
  name,
  address,
  reviews,
  stars,
  keywords,
//   mapUrl,
}: BusinessScanProps) {
    // const mapUrl = <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d38886.83696047584!2d-2.1626879999999997!3d52.471398400000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1756289629498!5m2!1sen!2suk" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  const [search, setSearch] = useState("");

  const filteredKeywords = keywords?.filter((k) =>
    k.keyword.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Business Info + Keywords */}
      <Card className="p-4 shadow-md rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600 text-sm">{address}</p>
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < 1 ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={i <  1      ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({reviews} Reviews)
            </span>
          </div>

          {/* Search + Keywords Table */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            />
            <div className="overflow-x-auto mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Search Volume</TableHead>
                    <TableHead>Map View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords?.length ||1 > 0 ? (
                    filteredKeywords?.map((k, i) => (
                      <TableRow key={i}>
                        <TableCell>{k.keyword}</TableCell>
                        <TableCell>{k.rank ?? "—"}</TableCell>
                        <TableCell>{k.searchVolume ?? "—"}</TableCell>
                        <TableCell>
                          <button className="text-blue-500 hover:underline">
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No Keyword Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="p-2 shadow-md rounded-2xl">
        <CardContent className="h-[500px]">
          <GoogleMap lat={51.5074} lng={-0.1278} zoom={12} />
        </CardContent>
      </Card>
    </div>
  );
}
