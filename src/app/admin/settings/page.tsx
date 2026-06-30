import { db } from "@/lib/db";
import { getPageBySlug } from "@/modules/cms/actions/pages";
import { VisualEditor } from "@/modules/cms/components/VisualEditor";
import { SettingsTabs } from "@/components/dashboard/SettingsTabs";
import { BrandingCustomizer } from "@/components/dashboard/BrandingCustomizer";

export const metadata = {
  title: "System Config & Branding | SewaCircle360 OS",
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
                    { value: "12+", label: "🛠️ Technologies Used" },
                    { value: "24/7", label: "🎧 Technical Support" },
                    { value: "100%", label: "🎯 Custom Solutions" },
                    { value: "Worldwide", label: "🌐 Service Availability" },
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

  const pageBuilderNode = page ? (
    <VisualEditor 
      pageId={page.id} 
      initialSections={sectionsList} 
    />
  ) : <p>CMS builder is temporarily offline.</p>;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          System Configuration & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure website CMS content sections or manage company PDF invoice/agreement color schemes and digital stamps.
        </p>
      </div>

      {/* Tabs */}
      <SettingsTabs 
        pageBuilder={pageBuilderNode} 
        brandingCustomizer={<BrandingCustomizer />} 
      />
    </div>
  );
}
