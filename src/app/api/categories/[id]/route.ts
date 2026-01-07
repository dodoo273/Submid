import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET specific category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)

    // Try to find as main category first
    const mainCat = await prisma.mainCategory.findUnique({
      where: { id: categoryId },
      include: { subCategories: true }
    })

    if (mainCat) {
      return NextResponse.json({ type: 'main', data: mainCat })
    }

    // Try to find as sub category
    const subCat = await prisma.subCategory.findUnique({
      where: { id: categoryId }
    })

    if (subCat) {
      return NextResponse.json({ type: 'sub', data: subCat })
    }

    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// UPDATE category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)
    const body = await request.json()
    const { type, name, description, mainCategoryId, icon, displayOrder } = body

    if (type === 'main') {
      const updated = await prisma.mainCategory.update({
        where: { id: categoryId },
        data: {
          name,
          description,
          icon,
          displayOrder: displayOrder !== undefined ? displayOrder : undefined
        }
      })
      return NextResponse.json(updated)
    } else if (type === 'sub') {
      const updated = await prisma.subCategory.update({
        where: { id: categoryId },
        data: {
          name,
          description,
          mainCategoryId: mainCategoryId ? parseInt(mainCategoryId) : undefined,
          displayOrder: displayOrder !== undefined ? displayOrder : undefined
        }
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)
    const { type } = await request.json()

    if (type === 'main') {
      // Check if main category has sub-categories
      const mainCat = await prisma.mainCategory.findUnique({
        where: { id: categoryId },
        include: { subCategories: true }
      })

      if (mainCat && mainCat.subCategories.length > 0) {
        return NextResponse.json(
          { error: 'Tidak bisa menghapus main category yang masih memiliki sub-category' },
          { status: 400 }
        )
      }

      await prisma.mainCategory.delete({
        where: { id: categoryId }
      })
    } else if (type === 'sub') {
      // Check if sub-category has menu items
      const menuItemsCount = await prisma.menuItem.count({
        where: { subCategoryId: categoryId }
      })

      if (menuItemsCount > 0) {
        return NextResponse.json(
          { error: 'Tidak bisa menghapus sub-category yang masih memiliki menu items' },
          { status: 400 }
        )
      }

      await prisma.subCategory.delete({
        where: { id: categoryId }
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
