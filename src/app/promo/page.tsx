import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";
import PromoClient from "./PromoClient";

export const metadata: Metadata = {
  title: "Promos - SUBMID Coffee",
  description: "Check out our latest promotions and special offers.",
};

export const dynamic = "force-dynamic";

async function getActivePromos() {
  const now = new Date();
  return await prisma.promo.findMany({
    where: {
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: { startAt: "desc" },
  });
}

export default async function PromoPage() {
  const promosRaw = await getActivePromos();
  const promos = promosRaw.map((p) => serializePrisma(p));

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 lg:pt-48 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="mb-20">
          <p className="text-amber-600 font-bold tracking-[0.4em] uppercase text-sm mb-6">Explore Our</p>
          <h1 className="text-6xl lg:text-8xl font-bold font-playfair text-gray-900 mb-8 border-l-4 border-amber-500 pl-8 leading-none">
            Exclusive <br/><span className="text-amber-600 italic">Promotions</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
            From seasonal blends to limited-time food pairings, discover the 
            special moments we've crafted for your next visit.
          </p>
        </header>

        <PromoClient promos={promos} />
      </div>
    </main>
  );
}
