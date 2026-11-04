import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "문장쏙 | 영어 문장 구조 분석",
  description: "복잡한 영어 문장도 구조부터 차근차근. 문장 성분과 핵심 문법을 한눈에 정리해 드려요.",
  applicationName: "문장쏙",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "문장쏙", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfbfa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* next/font has no Korean subset for these fonts, so load the full Google Fonts stylesheet. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Nanum+Pen+Script&display=swap"
        />
      </head>
      <body>
        {/* Phone-sized app frame. Inner components size themselves with container queries (@sm:, @md:)
            against this frame, so they look the same on a phone and in a desktop browser. */}
        <div className="@container relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background sm:border-x sm:border-border sm:shadow-[0_0_80px_oklch(15%_0_0/0.10)] md:max-w-lg">
          <div className="flex-1 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] @sm:px-5 @md:px-6 @md:pt-6">
            <Header />
            <main className="animate-fade-up">{children}</main>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
