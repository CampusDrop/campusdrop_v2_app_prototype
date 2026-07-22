"use client";

import { useEffect, useRef, useState } from "react";

type ScanStatus = "idle" | "starting" | "scanning" | "denied" | "unsupported";
type QrResult = { rawValue: string };
type QrDetector = { detect(source: HTMLVideoElement): Promise<QrResult[]> };
type QrDetectorConstructor = new (options: { formats: string[] }) => QrDetector;

export function useQrScanner(onDetected: (value: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");

  function stop() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    frameRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function start() {
    stop();
    if (!navigator.mediaDevices?.getUserMedia) return setStatus("unsupported");
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) return stop();
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      const Detector = (window as unknown as { BarcodeDetector?: QrDetectorConstructor }).BarcodeDetector;
      if (!Detector) return setStatus("unsupported");
      const detector = new Detector({ formats: ["qr_code"] });
      setStatus("scanning");
      const scanFrame = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const [result] = await detector.detect(videoRef.current);
          if (result?.rawValue) {
            stop();
            onDetected(result.rawValue);
            return;
          }
        } catch { /* 다음 프레임에서 다시 시도 */ }
        frameRef.current = requestAnimationFrame(scanFrame);
      };
      frameRef.current = requestAnimationFrame(scanFrame);
    } catch {
      stop();
      setStatus("denied");
    }
  }

  useEffect(() => stop, []);
  return { videoRef, status, start, stop };
}
