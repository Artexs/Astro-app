import { defineMiddleware } from "astro:middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const protectedRoutes = ["/my-cards", "/create", "/study", "/account", "/review"];
const authRoutes = ["/login", "/register"];

// context.locals.supabase = supabaseClient;
// context.locals.userID = "9c103c05-64ff-466c-a64b-1f490f3593a5";

// // This is a basic, hardcoded session for development purposes.
// // It simulates a logged-in user with a specific ID.
// context.locals.session = {
//   user: { id: "9c103c05-64ff-466c-a64b-1f490f3593a5" },
// };
export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY, {
    cookies: {
      get(key: string) {
        return context.cookies.get(key)?.value;
      },
      set(key: string, value: string, options: CookieOptions) {
        context.cookies.set(key, value, options);
      },
      remove(key: string, options: CookieOptions) {
        context.cookies.delete(key, options);
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  context.locals.supabase = supabase;
  context.locals.session = session;

  if (!session && protectedRoutes.includes(context.url.pathname)) {
    return context.redirect("/login");
  }

  if (session && authRoutes.includes(context.url.pathname)) {
    return context.redirect("/my-cards");
  }

  return next();
});
