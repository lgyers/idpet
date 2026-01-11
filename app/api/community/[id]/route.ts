import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * GET /api/community/[id]
 * 获取单个社区投稿详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.communitySubmission.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "投稿不存在" },
        { status: 404 }
      );
    }

    // 增加浏览次数
    await prisma.communitySubmission.update({
      where: { id: id },
      data: { views: submission.views + 1 },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("获取社区投稿失败:", error);
    return NextResponse.json(
      { error: "获取社区投稿失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/community/[id]
 * 更新社区投稿
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "请登录后操作" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id } = await params;

    // 检查权限
    const submission = await prisma.communitySubmission.findUnique({
      where: { id: id },
      select: { userId: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "投稿不存在" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user || submission.userId !== user.id) {
      return NextResponse.json(
        { error: "没有权限编辑此投稿" },
        { status: 403 }
      );
    }

    const updated = await prisma.communitySubmission.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        petName: data.petName,
        petBreed: data.petBreed,
      },
      include: {
        user: true,
        template: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新社区投稿失败:", error);
    return NextResponse.json(
      { error: "更新社区投稿失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/community/[id]
 * 删除社区投稿
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "请登录后操作" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查权限
    const submission = await prisma.communitySubmission.findUnique({
      where: { id: id },
      select: { userId: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "投稿不存在" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user || submission.userId !== user.id) {
      return NextResponse.json(
        { error: "没有权限删除此投稿" },
        { status: 403 }
      );
    }

    await prisma.communitySubmission.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除社区投稿失败:", error);
    return NextResponse.json(
      { error: "删除社区投稿失败" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/community/[id]/like
 * 点赞社区投稿
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action } = await request.json();
    const { id } = await params;

    if (action !== "like" && action !== "unlike") {
      return NextResponse.json(
        { error: "无效的操作" },
        { status: 400 }
      );
    }

    const submission = await prisma.communitySubmission.findUnique({
      where: { id: id },
      select: { likes: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "投稿不存在" },
        { status: 404 }
      );
    }

    const updated = await prisma.communitySubmission.update({
      where: { id: id },
      data: {
        likes: submission.likes + (action === "like" ? 1 : -1),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新点赞失败:", error);
    return NextResponse.json(
      { error: "更新失败" },
      { status: 500 }
    );
  }
}
