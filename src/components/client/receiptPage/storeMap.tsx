"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import PageLoader from "~/components/layout/pageLoader";

interface GeocodeResponseType {
  response?: {
    bbox?: [number, number, number, number];
  };
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

export default function StoreMap({ address }: { address: string }) {
  const [position, setPosition] = useState<[number, number]>([
    47.025604, 28.830367,
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGeocode = async () => {
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
        }),
      });
      const data = (await response.json()) as GeocodeResponseType;
      const coords = data?.response?.bbox;
      // for some locations, the geocode is not found by the API
      // to do: show appropiate fallback
      if (coords && coords.length > 3) setPosition([coords[3], coords[0]]);
      setLoading(false);
    };

    void getGeocode();
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "60vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[51.505, -0.09] as [number, number]} />
        </MapContainer>
      )}
    </>
  );
}
