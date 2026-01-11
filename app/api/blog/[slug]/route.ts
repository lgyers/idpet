import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/blog/[slug]
 * 获取单个博客文章
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        thumbnail: true,
        category: true,
        author: true,
        publishedAt: true,
        readTime: true,
        viewCount: true,
        likes: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "博客文章不存在" },
        { status: 404 }
      );
    }

    // 增加浏览次数
    await prisma.blogPost.update({
      where: { slug: slug },
      data: { viewCount: post.viewCount + 1 },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return NextResponse.json(
      { error: "获取博客文章失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/[slug]
 * 更新博客文章（仅管理员）
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const data = await request.json();
    const { slug } = await params;

    const post = await prisma.blogPost.update({
      where: { slug: slug },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnail,
        category: data.category,
        author: data.author,
        readTime: data.readTime,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        published: data.published,
        publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("更新博客文章失败:", error);
    return NextResponse.json(
      { error: "更新博客文章失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[slug]
 * 删除博客文章（仅管理员）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await prisma.blogPost.delete({
      where: { slug: slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除博客文章失败:", error);
    return NextResponse.json(
      { error: "删除博客文章失败" },
      { status: 500 }
    );
  }
}
