"use client";

import { useEffect, useRef, useState } from "react";

export type KakaoMapStatus = "loading" | "ready" | "missing-key" | "error";

type Coordinates = {
  lat: number;
  lng: number;
};

type KakaoLatLng = Coordinates;

type KakaoMapInstance = {
  panTo(position: KakaoLatLng): void;
  relayout(): void;
  setCenter(position: KakaoLatLng): void;
};

type KakaoCustomOverlayInstance = {
  setMap(map: KakaoMapInstance | null): void;
  setPosition(position: KakaoLatLng): void;
};

type KakaoMapsApi = {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  CustomOverlay: new (options: {
    content: HTMLElement;
    position: KakaoLatLng;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
  }) => KakaoCustomOverlayInstance;
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsApi;
    };
  }
}

type KakaoExpeditionMapProps = {
  chestCount: number;
  completedToday: boolean;
  focusRequest: number;
  onPositionChange(position: Coordinates): void;
  onStatusChange(status: KakaoMapStatus): void;
  onTreasureSelect(): void;
  showTreasures: boolean;
};

const CAMPUS_CENTER = { lat: 37.5502, lng: 127.0738 };
const KAKAO_SCRIPT_ID = "kakao-maps-javascript-sdk";
const treasurePoints = [
  { lat: 37.55102, lng: 127.07342, title: "종탑 남쪽 정원" },
  { lat: 37.55054, lng: 127.07506, title: "학술정보원 돌계단" },
  { lat: 37.54952, lng: 127.07412, title: "학생회관 게시판" },
];

function loadKakaoMaps(appKey: string) {
  return new Promise<KakaoMapsApi>((resolve, reject) => {
    const finishLoading = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오 지도 객체를 불러오지 못했습니다."));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };

    if (window.kakao?.maps) {
      finishLoading();
      return;
    }

    const existingScript = document.getElementById(KAKAO_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", finishLoading, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("카카오 지도 SDK 연결에 실패했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.addEventListener("load", finishLoading, { once: true });
    script.addEventListener("error", () => reject(new Error("카카오 지도 SDK 연결에 실패했습니다.")), { once: true });
    document.head.appendChild(script);
  });
}

function createTreasureMarker(
  index: number,
  chestCount: number,
  completedToday: boolean,
  onSelect: () => void,
) {
  const point = treasurePoints[index];
  const cleared = chestCount > index;
  const active = chestCount === index && !completedToday;
  const button = document.createElement("button");
  const marker = document.createElement("span");
  const copy = document.createElement("p");
  const label = document.createElement("small");
  const title = document.createElement("b");

  button.className = "map-treasure-marker kakao-treasure-marker";
  button.dataset.cleared = String(cleared);
  button.dataset.active = String(active);
  button.disabled = !active;
  button.setAttribute(
    "aria-label",
    `${point.title} 보물상자 ${cleared ? "개봉 완료" : active ? "탐사 가능" : "잠김"}`,
  );
  marker.textContent = cleared ? "✓" : active ? "▣" : "?";
  label.textContent = `탐사 지점 ${String.fromCharCode(65 + index)} · ${cleared ? "완료" : active ? "신호 발견" : "미확인"}`;
  title.textContent = cleared ? "발견 완료" : active ? point.title : "아직 확인 안 된 위치";
  copy.append(label, title);
  button.append(marker, copy);
  if (active) button.addEventListener("click", onSelect);

  return button;
}

function createExplorerMarker() {
  const marker = document.createElement("div");
  const scan = document.createElement("em");
  const icon = document.createElement("i");
  const label = document.createElement("span");

  marker.className = "current-location-pin kakao-current-location";
  marker.setAttribute("aria-label", "현재 위치");
  scan.setAttribute("aria-hidden", "true");
  icon.textContent = "⌖";
  label.textContent = "탐사대 위치";
  marker.append(scan, icon, label);
  return marker;
}

export function KakaoExpeditionMap({
  chestCount,
  completedToday,
  focusRequest,
  onPositionChange,
  onStatusChange,
  onTreasureSelect,
  showTreasures,
}: KakaoExpeditionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const mapsApiRef = useRef<KakaoMapsApi | null>(null);
  const explorerOverlayRef = useRef<KakaoCustomOverlayInstance | null>(null);
  const [status, setStatus] = useState<KakaoMapStatus>(() => (
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ? "loading" : "missing-key"
  ));

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
    if (!appKey) {
      onStatusChange("missing-key");
      return;
    }

    let active = true;
    onStatusChange("loading");

    loadKakaoMaps(appKey)
      .then((maps) => {
        if (!active || !containerRef.current) return;
        const center = new maps.LatLng(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng);
        mapsApiRef.current = maps;
        mapRef.current = new maps.Map(containerRef.current, { center, level: 3 });
        setStatus("ready");
        onStatusChange("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        onStatusChange("error");
      });

    return () => {
      active = false;
      mapRef.current = null;
      mapsApiRef.current = null;
    };
  }, [onStatusChange]);

  useEffect(() => {
    const map = mapRef.current;
    const maps = mapsApiRef.current;
    if (status !== "ready" || !map || !maps) return;

    const overlays: KakaoCustomOverlayInstance[] = [];
    if (showTreasures) {
      treasurePoints.forEach((point, index) => {
        const overlay = new maps.CustomOverlay({
          content: createTreasureMarker(index, chestCount, completedToday, onTreasureSelect),
          position: new maps.LatLng(point.lat, point.lng),
          xAnchor: 0.5,
          yAnchor: 1,
          zIndex: 5,
        });
        overlay.setMap(map);
        overlays.push(overlay);
      });
    }

    const explorerOverlay = new maps.CustomOverlay({
      content: createExplorerMarker(),
      position: new maps.LatLng(CAMPUS_CENTER.lat, CAMPUS_CENTER.lng),
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 6,
    });
    explorerOverlay.setMap(map);
    explorerOverlayRef.current = explorerOverlay;
    overlays.push(explorerOverlay);

    const handleResize = () => map.relayout();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      overlays.forEach((overlay) => overlay.setMap(null));
      explorerOverlayRef.current = null;
    };
  }, [chestCount, completedToday, onTreasureSelect, showTreasures, status]);

  useEffect(() => {
    if (focusRequest === 0 || status !== "ready") return;
    const map = mapRef.current;
    const maps = mapsApiRef.current;
    if (!map || !maps) return;

    const moveTo = (position: Coordinates) => {
      const nextPosition = new maps.LatLng(position.lat, position.lng);
      explorerOverlayRef.current?.setPosition(nextPosition);
      map.panTo(nextPosition);
      onPositionChange(position);
    };

    if (!navigator.geolocation) {
      moveTo(CAMPUS_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => moveTo({ lat: coords.latitude, lng: coords.longitude }),
      () => moveTo(CAMPUS_CENTER),
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 8_000 },
    );
  }, [focusRequest, onPositionChange, status]);

  return (
    <div className="kakao-map-layer" data-status={status}>
      <div ref={containerRef} className="kakao-map-surface" aria-label="세종대학교 주변 카카오 지도" />
      <div className="kakao-map-brand-blur" aria-hidden="true" />
      {status !== "ready" && (
        <div className="kakao-map-status" role="status">
          <i>{status === "loading" ? "…" : "⌖"}</i>
          <span>
            <b>{status === "loading" ? "카카오 지도를 연결하는 중" : status === "missing-key" ? "탐사 지도 준비 중" : "지도를 불러오지 못했어요"}</b>
            <small>{status === "missing-key" ? "지도 키를 연결하면 실제 캠퍼스 지도가 표시됩니다." : status === "error" ? "등록된 도메인과 지도 키를 확인해 주세요." : "잠시만 기다려 주세요."}</small>
          </span>
        </div>
      )}
    </div>
  );
}
