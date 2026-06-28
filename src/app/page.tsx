import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { SectionRenderer } from "@/modules/cms/components/SectionRenderer";
import { getPageBySlug } from "@/modules/cms/actions/pages";

const DEFAULT_SECTIONS = [
  {
    type: "HERO",
    content: {
      tagline: "Engineering Digital Excellence",
      headline: "We Build",
      typingWords: [
        "Powerful Software.",
        "Modern Websites.",
        "Mobile Apps.",
        "SaaS Products.",
        "Digital Businesses."
      ],
      description: "Transform your vision into high-performance enterprise platforms. We engineer scalable software architecture, custom website experiences, and modular SaaS ecosystems.",
      primaryBtnText: "Start Your Project",
      primaryBtnLink: "/contact",
      secondaryBtnText: "Explore Services",
      secondaryBtnLink: "/services",
    }
  },
  {
    type: "STATISTICS",
    content: {
      stats: [
        { value: "150+", label: "Projects Completed" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "12+", label: "SaaS Products" },
        { value: "7+", label: "Years Experience" },
      ]
    }
  },
  {
    type: "SERVICES",
    content: {}
  },
  {
    type: "PROCESS",
    content: {}
  },
  {
    type: "FAQ",
    content: {}
  },
  {
    type: "CTA",
    content: {
      headline: "Ready to Transform Your Operations?",
      description: "Let's build a premium digital ecosystem customized for your business workflows. Schedule a session or get a customized service quote today.",
      primaryBtnText: "Book a Consultation",
      primaryBtnLink: "/book-meeting",
      secondaryBtnText: "Contact Team",
      secondaryBtnLink: "/contact",
    }
  }
];

export default async function Home() {
  const page = await getPageBySlug("home");
  const sections = page?.sections && page.sections.length > 0 
    ? page.sections 
    : DEFAULT_SECTIONS;

  return (
    <>
      <Header />
      <main className="flex-grow">
        {sections.map((section: any, idx: number) => (
          <SectionRenderer 
            key={section.id || idx} 
            type={section.type} 
            content={section.content} 
          />
        ))}
      </main>
      <Footer />
    </>
  );
}

