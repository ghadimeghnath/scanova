// src/app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/orders/[id] — fetch single order (by id or orderNumber)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: true,
            arExperience: true,
            stickerExperience: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[GET /api/orders/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — admin: update order status
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentId, notes } = body;

    const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

    const data = {};
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = status;
    }
    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      data.paymentStatus = paymentStatus;
    }
    if (paymentId) data.paymentId = paymentId;
    if (notes !== undefined) data.notes = notes;

    const order = await prisma.order.update({
      where: { id },
      data,
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[PATCH /api/orders/[id]]", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}