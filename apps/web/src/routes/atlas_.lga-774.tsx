import { createFileRoute } from '@tanstack/react-router';
import { getPage } from '../page-data';
import { pageHead } from '../editorial';
import { PortalPage } from '../portal-page';
export const Route=createFileRoute('/atlas_/lga-774')({loader:({location})=>getPage({data:{path:location.pathname,query:location.searchStr}}),head:({loaderData})=>pageHead(loaderData),component:()=> <PortalPage page={Route.useLoaderData()}/>});
