export type SectionType = 
  | "HERO"
  | "STATISTICS"
  | "WHY_CHOOSE_US"
  | "SERVICES"
  | "PRODUCTS"
  | "PORTFOLIO"
  | "PROCESS"
  | "TECH_STACK"
  | "TESTIMONIALS"
  | "FAQ"
  | "CTA"
  | "CONTACT_FORM";

export interface SectionData {
  id: string;
  pageId: string;
  type: SectionType | string;
  order: number;
  content: any; // Dynamic JSON dependent on the section type
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "DRAFT" | "PUBLISHED" | string;
  sections?: SectionData[];
  createdAt?: Date;
  updatedAt?: Date;
}
