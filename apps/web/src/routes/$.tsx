import { createFileRoute, notFound } from '@tanstack/react-router';
import { getPage } from '../page-data';
import { pageHead } from '../editorial';
import { PortalPage } from '../portal-page';
export const Route=createFileRoute('/$')({loader:async({location})=>{const page=await getPage({data:{path:location.pathname,query:location.searchStr}});if(page.kind==='missing')throw notFound();return page;},head:({loaderData})=>pageHead(loaderData),component:Page});
function Page(){return <PortalPage page={Route.useLoaderData()}/>;}
