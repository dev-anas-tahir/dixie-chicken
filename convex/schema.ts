import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - stores user account information synchronized with Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("staff"), v.literal("admin")),
    phoneNumber: v.optional(v.string()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // Branches table - stores restaurant branch location information
  branches: defineTable({
    name: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    phoneNumber: v.string(),
    email: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_isActive", ["isActive"]),

  // Categories table - stores menu item category classifications
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_isActive", ["isActive"])
    .index("by_displayOrder", ["displayOrder"]),

  // Menu Items table - stores food and beverage products
  menuItems: defineTable({
    categoryId: v.id("categories"),
    branchId: v.optional(v.id("branches")),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    isAvailable: v.boolean(),
    preparationTime: v.optional(v.number()),
  })
    .index("by_categoryId", ["categoryId"])
    .index("by_branchId", ["branchId"])
    .index("by_isAvailable_categoryId", ["isAvailable", "categoryId"]),

  // Tables table - stores physical dining tables at restaurant branches
  tables: defineTable({
    branchId: v.id("branches"),
    tableNumber: v.string(),
    capacity: v.number(),
    status: v.union(
      v.literal("available"),
      v.literal("occupied"),
      v.literal("reserved")
    ),
  })
    .index("by_branchId", ["branchId"])
    .index("by_branchId_status", ["branchId", "status"])
    .index("by_branchId_tableNumber", ["branchId", "tableNumber"]),

  // Orders table - stores customer order information
  orders: defineTable({
    userId: v.id("users"),
    branchId: v.id("branches"),
    tableId: v.optional(v.id("tables")),
    orderNumber: v.string(),
    orderType: v.union(
      v.literal("dine-in"),
      v.literal("takeout"),
      v.literal("delivery")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    totalAmount: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_userId", ["userId"])
    .index("by_branchId", ["branchId"])
    .index("by_status", ["status"])
    .index("by_branchId_status", ["branchId", "status"]),

  // Order Items table - stores individual line items within orders
  orderItems: defineTable({
    orderId: v.id("orders"),
    menuItemId: v.id("menuItems"),
    quantity: v.number(),
    priceAtOrder: v.number(),
    subtotal: v.number(),
    specialInstructions: v.optional(v.string()),
  })
    .index("by_orderId", ["orderId"])
    .index("by_menuItemId", ["menuItemId"]),

  // Payments table - stores payment transaction information
  payments: defineTable({
    orderId: v.id("orders"),
    stripePaymentIntentId: v.optional(v.string()),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.union(
      v.literal("card"),
      v.literal("cash"),
      v.literal("other")
    ),
    transactionDate: v.optional(v.number()),
  })
    .index("by_orderId", ["orderId"])
    .index("by_stripePaymentIntentId", ["stripePaymentIntentId"])
    .index("by_status", ["status"]),

  // Analytics table - stores aggregated business intelligence data
  analytics: defineTable({
    branchId: v.optional(v.id("branches")),
    periodStart: v.number(),
    periodEnd: v.number(),
    totalRevenue: v.number(),
    orderCount: v.number(),
    customerCount: v.number(),
    averageOrderValue: v.number(),
    topMenuItems: v.optional(v.array(v.object({
      menuItemId: v.id("menuItems"),
      name: v.string(),
      orderCount: v.number(),
      revenue: v.number(),
    }))),
  })
    .index("by_branchId", ["branchId"])
    .index("by_branchId_periodStart", ["branchId", "periodStart"])
    .index("by_periodStart_periodEnd", ["periodStart", "periodEnd"]),
});
