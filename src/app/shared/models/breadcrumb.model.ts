import { IBreadcrumb, IBreadcrumbList } from "../interfaces/breadcrumb.interface";

export class BreadcrumbListModel implements IBreadcrumbList {
  title:string;
  breadcrumbs:BreadcrumbModel[];
}

export class BreadcrumbModel implements IBreadcrumb{
  title:string;
  link:string;
}
