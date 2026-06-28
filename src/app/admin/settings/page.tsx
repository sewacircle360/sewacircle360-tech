import { db } from "@/lib/db";
import { getPageBySlug } from "@/modules/cms/actions/pages";
import { VisualEditor } from "@/modules/cms/components/VisualEditor";

export const metadata = {
  title: "Website Builder Settings | SewaCircle360 OS",
};

export default async function AdminSettingsPage() {
  let page = await getPageBySlug("home");

  // Auto-seed homepage in database on first load if missing
  if (!page) {
    try {
      page = await db.page.create({
        data: {
          title: "Homepage",
          slug: "home",
          status: "PUBLISHED",
          sections: {
            create: [
              { 
                type: "HERO", 
                order: 1, 
                content: { 
                  headline: "We Build", 
                  description: "Transform your vision into high-performance enterprise platforms. We engineer scalable software architecture, custom website experiences, and modular SaaS ecosystems." 
                } 
              },
              { 
                type: "STATISTICS", 
                order: 2, 
                content: {
                  stats: [
                    { value: "150+", label: "Projects Completed" },
                    { value: "98%", label: "Client Satisfaction" },
                    { value: "12+", label: "SaaS Products" },
                    { value: "7+", label: "Years Experience" },
                  ]
                }
              },
              { type: "SERVICES", order: 3, content: {} },
              { type: "PROCESS", order: 4, content: {} },
              { type: "FAQ", order: 5, content: {} },
              { 
                type: "CTA", 
                order: 6, 
                content: { 
                  headline: "Ready to Transform Your Operations?", 
                  description: "Let's build a premium digital ecosystem customized for your business workflows. Schedule a session or get a customized service quote today." 
                } 
              },
            ]
          }
        },
        include: {
          sections: { orderBy: { order: "asc" } }
        }
      });
    } catch (err) {
      console.error("Auto-seed page builder failed:", err);
    }
  }

  const sectionsList = page?.sections ? page.sections.map(s => ({
    id: s.id,
    type: s.type,
    order: s.order,
    content: s.content
  })) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Page Builder & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize website visual blocks, update section content, and reorder public elements.
        </p>
      </div>

      {/* Page Builder CMS */}
      {page && (
        <VisualEditor 
          pageId={page.id} 
          initialSections={sectionsList} 
        />
      )}
    </div>
  );
}
