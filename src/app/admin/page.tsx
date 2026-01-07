import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/utils";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel - SUBMID Coffee",
  description: "Manage menu items, categories, and more.",
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

async function getMenuItems() {
  return await prisma.menuItem.findMany({
    where: { deletedAt: null },
    include: {
      subCategory: {
        include: {
          mainCategory: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export default async function AdminPage() {
  const categories = await getCategories();
  const menuItemsRaw = await getMenuItems();

  // Serialize Prisma types (Decimal, Date) to plain values
  const menuItems = menuItemsRaw.map((item) => serializePrisma(item));

  return <AdminClient categories={categories} menuItems={menuItems} />;
}
