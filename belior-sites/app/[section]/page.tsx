import Belior from '../Belior';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!['maison','collection','products','objects','music','atelier','journal','private','lounge'].includes(section))notFound();return <Belior page={section}/>}
