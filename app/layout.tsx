import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const baseUrl = new URL(`${protocol}://${host ?? "localhost:3000"}`);

  return {
    metadataBase: baseUrl,
    title: {
      default: "CampusDrop — 캠퍼스가 게임판이 됩니다",
      template: "%s | CampusDrop",
    },
    description:
      "GPS와 AR 단서를 팀원들과 해결하고 캠퍼스 혜택을 받는 협동 방탈출 탐험 앱 프로토타입입니다.",
    openGraph: {
      title: "CampusDrop",
      description: "캠퍼스가 게임판이 됩니다",
      images: [{ url: new URL("/og-v2.png", baseUrl).toString() }],
    },
    twitter: {
      card: "summary_large_image",
      images: [new URL("/og-v2.png", baseUrl).toString()],
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
