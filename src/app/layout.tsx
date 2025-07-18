import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import ClientLayout from "./ClientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
});
const cookierun = localFont({
  src: "./fonts/CookieRun-Regular.woff",
  variable: "--font-cookierun",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "더 웨딩 랩 :: AI 모바일 청첩장 생성 앱",
  description:
    "AI로 간편하게 만드는 개성 있는 모바일 청첩장. 갤러리, 지도, 계좌정보까지 한 번에!",
  keywords: ["모바일청첩장", "웨딩", "청첩장", "결혼", "AI청첩장"],
  authors: [{ name: "더 웨딩 랩" }],
  viewport: {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    minimumScale: 1.0,
    userScalable: false,
  },
  robots: "index, follow",
  openGraph: {
    title: "더 웨딩 랩 :: AI 모바일 청첩장 생성 앱",
    description: "AI로 간편하게 만드는 개성 있는 모바일 청첩장",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "더 웨딩 랩 :: AI 모바일 청첩장 생성 앱",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} ${cookierun.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
