import type { Metadata } from "next";
import "./globals.css";
import "./office.css";

export const metadata: Metadata = {
 title: "BELiOR — Music · Atelier · Parfum · Objects",
 description: "메종 BELiOR. 프라이빗 음악 공연, 동물 컬렉션과 아틀리에의 세계. Maison BELiOR, Seoul.",
 openGraph: {title: "BELiOR — The evening, composed.", description: "Music · Atelier · Parfum · Objects", images: ["/belior/world.webp"]},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
