import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("lost"), v.literal("found"))),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let itemsQuery;
    
    if (args.type) {
      itemsQuery = ctx.db
        .query("items")
        .withIndex("by_type", (q) => q.eq("type", args.type as "lost" | "found"));
    } else {
      itemsQuery = ctx.db.query("items");
    }
    
    const items = await itemsQuery
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(args.limit || 20);

    return Promise.all(
      items.map(async (item) => {
        const user = await ctx.db.get(item.userId);
        return {
          ...item,
          userName: user?.name || user?.email || "Anonymous",
          imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
        };
      })
    );
  },
});

export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.union(v.literal("lost"), v.literal("found"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let searchQuery = ctx.db
      .query("items")
      .withSearchIndex("search_items", (q) => q.search("description", args.query));

    if (args.type) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("type"), args.type));
    }
    
    if (args.category) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("category"), args.category));
    }

    const items = await searchQuery
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(20);

    return Promise.all(
      items.map(async (item) => {
        const user = await ctx.db.get(item.userId);
        return {
          ...item,
          userName: user?.name || user?.email || "Anonymous",
          imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
        };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;

    const user = await ctx.db.get(item.userId);
    return {
      ...item,
      userName: user?.name || user?.email || "Anonymous",
      imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    type: v.union(v.literal("lost"), v.literal("found")),
    location: v.string(),
    dateLostFound: v.optional(v.number()),
    contactInfo: v.string(),
    imageId: v.optional(v.id("_storage")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create an item");
    }

    return await ctx.db.insert("items", {
      ...args,
      userId,
      dateReported: Date.now(),
      status: "active",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("resolved"), v.literal("expired"))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.userId !== userId) {
      throw new Error("Can only update your own items");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const getUserItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const items = await ctx.db
      .query("items")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to upload images");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
