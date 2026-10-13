import Belior from '../../Belior';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{section:string,detail:string}>}){const {section,detail}=await params;const valid=section==='collection'?['lion','swan','orca','leopard','panther','phoenix']:section==='products'?['parfum','bag','clothing','objects','no-16']:section==='music'?['artists','performances','gala','inquiry']:[];if(!valid.includes(detail))notFound();return <Belior page={section} detail={detail}/>}
