"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    scannerRef.current = new Html5QrcodeScanner(
      mountRef.current.id,
      { fps: 10, qrbox: 250 },
      false,
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
      },
      (errorMessage) => {
        console.log(errorMessage);
      },
    );

    return () => {
      if (scannerRef.current?.clear) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="flex items-center justify-center rounded-xl bg-gray-100 p-4 shadow-lg">
      <div
        id="reader"
        ref={mountRef}
        className="h-80 w-80 overflow-hidden rounded-lg border-4 border-dashed border-gray-300"
      />
    </div>
  );
}
