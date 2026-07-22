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
      default: "CampusDrop — 캠퍼스의 오늘을 발견하세요",
      template: "%s | CampusDrop",
    },
    description:
      "우리 학교의 맛집, 스터디, 행사와 중고 소식을 한곳에서 발견하는 캠퍼스 생활 플랫폼입니다.",
    openGraph: {
      title: "CampusDrop",
      description: "오늘 캠퍼스의 모든 발견",
      images: [{ url: new URL("/og.png", baseUrl).toString() }],
    },
    twitter: {
      card: "summary_large_image",
      images: [new URL("/og.png", baseUrl).toString()],
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
