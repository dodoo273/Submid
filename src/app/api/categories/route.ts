import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const mainCategories = await prisma.mainCategory.findMany({
      include: {
        subCategories: {
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    })
    
    return NextResponse.json(mainCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, description, mainCategoryId, icon, displayOrder } = body
    
    if (type === 'main') {
      const category = await prisma.mainCategory.create({
        data: {
          name,
          description,
          icon,
          displayOrder: displayOrder || 0
        }
      })
      return NextResponse.json(category, { status: 201 })
    } else if (type === 'sub') {
      const subCategory = await prisma.subCategory.create({
        data: {
          name,
          description,
          mainCategoryId: parseInt(mainCategoryId),
          displayOrder: displayOrder || 0
        }
      })
      return NextResponse.json(subCategory, { status: 201 })
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
