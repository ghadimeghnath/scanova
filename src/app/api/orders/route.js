// src/app/api/orders/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber, isValidEmail, isValidPhone, isValidPincode } from "@/lib/utils";

// POST /api/orders — place a new order
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      items, // [{ productId, quantity }]
      paymentMethod = "cod",
      notes = "",
    } = body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!customerName?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!isValidEmail(customerEmail)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    if (!isValidPhone(customerPhone)) return NextResponse.json({ error: "Valid 10-digit phone is required" }, { status: 400 });
    if (!addressLine1?.trim()) return NextResponse.json({ error: "Address is required" }, { status: 400 });
    if (!city?.trim()) return NextResponse.json({ error: "City is required" }, { status: 400 });
    if (!state?.trim()) return NextResponse.json({ error: "State is required" }, { status: 400 });
    if (!isValidPincode(pincode)) return NextResponse.json({ error: "Valid 6-digit pincode is required" }, { status: 400 });
    if (!items || items.length === 0) return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });

    // ── Fetch products + validate stock ─────────────────────────────────────
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products not found or inactive" }, { status: 400 });
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    // Stock check
    for (const item of items) {
      const product = productMap[item.productId];
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // ── Calculate pricing ────────────────────────────────────────────────────
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = productMap[item.productId];
      const unitPrice = product.price;
      const total = unitPrice * item.quantity;
      subtotal += total;
      return { productId: item.productId, quantity: item.quantity, unitPrice, total };
    });

    const shippingCharge = subtotal >= 99900 ? 0 : 4900; // free shipping over ₹999
    const total = subtotal + shippingCharge;

    // ── Generate order number ────────────────────────────────────────────────
    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount + 1);

    // ── Create order in transaction ──────────────────────────────────────────
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order + items
      return tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2?.trim() || "",
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          paymentMethod,
          subtotal,
          shippingCharge,
          total,
          notes: notes.trim(),
          status: paymentMethod === "cod" ? "confirmed" : "pending",
          paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
          items: {
            create: orderItems,
          },
        },
        include: { items: { include: { product: true } } },
      });
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Failed to place order. Please try again." }, { status: 500 });
  }
}

// GET /api/orders — admin: list all orders with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== "all" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: "insensitive" } },
              { customerName: { contains: search, mode: "insensitive" } },
              { customerEmail: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}