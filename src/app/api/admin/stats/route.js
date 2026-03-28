// src/app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      revenueThis,
      revenueLast,
      totalProducts,
      activeKeychains,
      totalScans,
      recentOrders,
      ordersByStatus,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),

      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, paymentStatus: { not: "failed" } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, paymentStatus: { not: "failed" } },
        _sum: { total: true },
      }),

      prisma.product.count({ where: { isActive: true } }),
      prisma.aRExperience.count({ where: { isActive: true } }),

      prisma.aRExperience.aggregate({ _sum: { scanCount: true } }),

      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),

      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      prisma.product.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),
    ]);

    const revenueThisMonthPaise = revenueThis._sum.total || 0;
    const revenueLastMonthPaise = revenueLast._sum.total || 0;
    const revenueGrowth =
      revenueLastMonthPaise > 0
        ? (((revenueThisMonthPaise - revenueLastMonthPaise) / revenueLastMonthPaise) * 100).toFixed(1)
        : null;

    const orderGrowth =
      ordersLastMonth > 0
        ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)
        : null;

    const statusMap = Object.fromEntries(ordersByStatus.map((s) => [s.status, s._count.status]));

    return NextResponse.json({
      totalOrders,
      ordersThisMonth,
      orderGrowth,
      revenueThisMonth: revenueThisMonthPaise,
      revenueGrowth,
      totalProducts,
      activeKeychains,
      totalScans: totalScans._sum.scanCount || 0,
      recentOrders,
      ordersByStatus: statusMap,
      lowStockProducts,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}