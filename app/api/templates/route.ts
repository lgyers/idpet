import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') || undefined
    const templates = await prisma.sceneTemplate.findMany({
      where: category ? { category } : undefined,
      orderBy: { usageCount: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        thumbnail: true,
        basePrompt: true,
      },
    })

    return NextResponse.json({
      success: true,
      templates: templates.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        description: t.description,
        category: t.category,
        preview: t.thumbnail,
        prompt: t.basePrompt,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

