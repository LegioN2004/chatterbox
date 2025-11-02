## next js grouped folders

here we have the (signed-in) folder which contains all the pages that require user authentication to access. This is a common pattern in Next.js applications to organize routes based on their access requirements.

This folder is invisible and has no effect on the routes themselves. The parentheses indicate that it's a special folder used for grouping related routes together without affecting the URL structure.

We use this when we want to have a special layout or middleware kinda that applies to all the folders or routes beneath it. Parent layout.tsx has effect on this though.

## protected routes

for protecting routes so that people can't get to them without signing in, we can use middleware.ts file in the root of the app directory. This middleware will check if the user is authenticated before allowing access to any routes under the (signed-in) folder.

```tsx
const isAuthenticatedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (!isAuthenticatedRoute(req)) {
		await auth.protect();
	}
});
```

The above example shows how we can make that in nextjs and clerk. Here, we create a route matcher for all routes under /dashboard and use the clerkMiddleware to protect those routes. If a user tries to access any of these routes without being authenticated, they will be redirected to the sign-in page.

## _generated/server
This folder is automatically created by Clerk and contains server-side code that helps manage authentication and user sessions. You typically don't need to interact with this folder directly, as it's handled by Clerk internally.

- query, mutation, etc hooks and other utilities come from there to work with Clerk in a Next.js application, update and all.
- Also that _generated/server allows that all that we do are type safe and we get autocompletion and all that good stuff.


## UserSyncWrapper

custom component that can be used to 

## server actions

It is a next js thing which allows the server side code to be run from the client side. This is useful when we want to do some server side operations like database operations, api calls, etc from the client side.

Simply it reduces the overhead, like setup rest api then call then get the request and then show, it's just loooooong. So use this instead


