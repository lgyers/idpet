import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/blog
 * 获取博客文章列表（分页）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;
    const where: any = {
      published: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          category: true,
          author: true,
          publishedAt: true,
          readTime: true,
          viewCount: true,
          likes: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取博客列表失败:", error);
    return NextResponse.json(
      { error: "获取博客列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog
 * 创建博客文章（仅管理员）
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 验证必需字段
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return NextResponse.json(
        { error: "缺少必需的字段" },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "该 slug 已存在" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnail,
        category: data.category || "news",
        author: data.author || "PetPhoto Team",
        readTime: data.readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("创建博客失败:", error);
    return NextResponse.json(
      { error: "创建博客失败" },
      { status: 500 }
    );
  }
}
