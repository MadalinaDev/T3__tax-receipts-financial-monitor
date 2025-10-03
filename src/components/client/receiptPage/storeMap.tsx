"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import PageLoader from "~/components/layout/pageLoader";
import { HiMapPin } from "react-icons/hi2";
import ReactDOMServer from "react-dom/server";
import type { DivIcon } from "leaflet";

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
  const [customIcon, setCustomIcon] = useState<DivIcon>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGeocode = async () => {
      try {
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
      } catch (error) {
        console.log("Client-sided error: ", error);
      } finally {
        setLoading(false);
      }
    };

    void getGeocode();
  }, [address]);

  useEffect(() => {
    const createCustomIcon = async () => {
      if (typeof window === "undefined") return;

      const L = await import("leaflet");
      const icon = L.divIcon({
      className: "custom-pin-icon",
        html: ReactDOMServer.renderToString(
          <HiMapPin size={34} className="text-red-800" />,
        ),
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });
      setCustomIcon(icon);
    };

    void createCustomIcon();
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "60vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon} />
        </MapContainer>
      )}
    </>
  );
}
