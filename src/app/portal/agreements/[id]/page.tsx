import { getAgreementById } from "@/modules/agreements/actions/agreements";
import { AgreementSigner } from "@/modules/agreements/components/AgreementSigner";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Review Agreement | SewaCircle360 Portal",
};

export default async function PortalAgreementPage({ params }: PageProps) {
  const { id } = await params;
  const agreement = await getAgreementById(id);

  if (!agreement) {
    notFound();
  }

  const formattedAgreement = {
    ...agreement,
    signedAt: agreement.signedAt ? agreement.signedAt.toISOString() : null,
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgreementSigner agreement={formattedAgreement} />
      </div>
    </main>
  );
}
