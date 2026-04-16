import type { ServiceTag } from './home';

export interface GlobalServiceCms {
  title: string;
  slug: string;
  heroBodyText: string | null;
  tags: ServiceTag[];
}

export interface GlobalData {
  services: GlobalServiceCms[] | null;
}
