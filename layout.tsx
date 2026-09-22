import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'BELiOR — Maison Collection', description:'BELiOR MAISON COLLECTION. 스카프, 카드 지갑, 파우치와 디지털 액세서리 컬렉션 시안.', icons:{icon:'/images/belior-symbol.png'} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body>{children}</body></html>}
