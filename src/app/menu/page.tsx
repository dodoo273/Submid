import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";
import { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu - SUBMID Coffee",
  description:
    "Explore our premium coffee menu with specialty drinks, cold brews, and more.",
};

export const dynamic = "force-dynamic";

async function getCategories() {
  const mainCategories = await prisma.mainCategory.findMany({
    include: {
      subCategories: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return mainCategories;
}

async function getMenuItems(subCategoryId?: number) {
  const where = subCategoryId
    ? { subCategoryId, isAvailable: true, deletedAt: null }
    : { isAvailable: true, deletedAt: null };

  return await prisma.menuItem.findMany({
    where,
    include: {
      subCategory: true,
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}

async function getFirstSubCategoryId() {
  const first = await prisma.subCategory.findFirst({
    orderBy: [
      { mainCategory: { displayOrder: "asc" } },
      { displayOrder: "asc" },
    ],
  });
  return first?.id ?? null;
}

interface MenuPageProps {
  searchParams: Promise<{ sub_id?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const categoriesRaw = await getCategories();
  const categories = categoriesRaw.map(cat => serializePrisma(cat));

  let subCategoryId = params.sub_id ? parseInt(params.sub_id) : null;

  // If no sub_id provided, get the first one
  if (!subCategoryId) {
    const firstId = await getFirstSubCategoryId();
    if (firstId === null) {
      // No subcategories at all
      return (
        <div className="min-h-screen flex items-center justify-center">
          No menu available
        </div>
      );
    }
    subCategoryId = firstId;
  }

  const menuItemsRaw = await getMenuItems(subCategoryId);

  // Serialize Prisma types for client components
  const menuItems = menuItemsRaw.map((item) => serializePrisma(item));

  // Get current sub category name
  let currentSubCategoryName = "Menu";
  for (const cat of categories) {
    const sub = (cat as any).subCategories.find((s: any) => s.id === subCategoryId);
    if (sub) {
      currentSubCategoryName = sub.name;
      break;
    }
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <MenuClient
        categories={categories}
        menuItems={menuItems}
        currentSubCategoryId={subCategoryId}
        currentSubCategoryName={currentSubCategoryName}
      />
    </Suspense>
  );
}
