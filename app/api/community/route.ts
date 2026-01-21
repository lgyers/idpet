import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * GET /api/community
 * 获取社区投稿列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.get("featured") === "true";
    const templateId = searchParams.get("templateId");

    const skip = (page - 1) * limit;
    const where: Prisma.CommunitySubmissionWhereInput = {
      approved: true,
    };

    if (featured) {
      where.featured = true;
    }

    if (templateId) {
      where.templateId = templateId;
    }

    const [submissions, total] = await Promise.all([
      prisma.communitySubmission.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          petName: true,
          petBreed: true,
          template: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likes: true,
          views: true,
          createdAt: true,
        },
        orderBy: {
          featured: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.communitySubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取社区投稿失败:", error);
    return NextResponse.json(
      { error: "获取社区投稿失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/community
 * 创建社区投稿
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "请登录后提交" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // 验证必需字段
    if (!data.title || !data.imageUrl || !data.petName || !data.templateId) {
      return NextResponse.json(
        { error: "缺少必需的字段" },
        { status: 400 }
      );
    }

    // 获取用户 ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description || "",
        imageUrl: data.imageUrl,
        petName: data.petName,
        petBreed: data.petBreed,
        templateId: data.templateId,
        approved: false, // 需要管理员审核
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("创建社区投稿失败:", error);
    return NextResponse.json(
      { error: "创建社区投稿失败" },
      { status: 500 }
    );
  }
}
