"use client";

import { Card, CardContent } from "@/components/ui/card";

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: string;
  height?: string;
}

export default function GoogleMap({ 
  lat, 
  lng, 
  zoom = 14, 
  width = "100%", 
  height = "500px" 
}: GoogleMapProps) {
  const src = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`;

  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent className="p-0">
        <iframe
          src={src}
          width={width}
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-2xl w-full"
        />
      </CardContent>
    </Card>
  );
}
