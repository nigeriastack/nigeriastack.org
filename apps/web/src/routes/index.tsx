import { createFileRoute } from '@tanstack/react-router';
import { getPage } from '../page-data';
import { pageHead } from '../editorial';
import { PortalPage } from '../portal-page';
export const Route=createFileRoute('/')({loader:()=>getPage({data:{path:'/',query:''}}),head:({loaderData})=>pageHead(loaderData),component:()=> <PortalPage page={Route.useLoaderData()}/>});
