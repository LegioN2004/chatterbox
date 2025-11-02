import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// these are now cloud functions

// fetch user by clerk userId
export const getClerkUserById = query({
    // argument type
    args: {
        userId: v.string(),
    },
    // ctx = context, and args which is userId here
    handler: async (ctx: any, { userId }) => {
        if (!userId) return null;
        return await ctx.db
            .query("users")
            .withIndex("by_userId", (q: any) => q.eq("userId", userId))
            .first();
    },
});

// create or update clerk user
export const upsertClerkUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx: any, { userId, name, email, imageUrl }) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_userId", (q: any) => q.eq("userId", userId))
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                name,
                imageUrl,
            });
            return existingUser._id;
        }

        return await ctx.db.insert("users", { userId, name, email, imageUrl });
    },
});

// this is for searching when we select the user who we want to talk to in a new chat
export const searchUsers = query({
    args: {
        searchTerm: v.string(),
    },
    handler: async (ctx, { searchTerm }) => {
        if (!searchTerm) return [];

        const normalizedSearch = searchTerm.toLowerCase().trim();

        // get all users with query("users").collect();
        // then filter them in memory
        const allUsers = await ctx.db.query("users").collect();

        // filter out the matching users either in name or email

        return allUsers.filter((user: any) => {
            return (
                user.name.toLowerCase().includes(normalizedSearch) ||
                user.email.toLowerCase().includes(normalizedSearch)
            );
        }).slice(0, 20); // limit to 20 results for perf
    },
})