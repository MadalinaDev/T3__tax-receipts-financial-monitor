import { type NextRequest, NextResponse } from "next/server";

interface GeocodeApiResponse {
  response?: {
    bbox?: [number, number, number, number];
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { address: string };
  const { address } = body;
  const response = await fetch(
    `https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_KEY}&q=${encodeURIComponent(address)}`,
  );
  const data = (await response.json()) as GeocodeApiResponse;

  return NextResponse.json(data);
}
