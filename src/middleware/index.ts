import { defineMiddleware } from "astro:middleware";

import { supabaseClient } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.supabase = supabaseClient;
  context.locals.userID = "9c103c05-64ff-466c-a64b-1f490f3593a5";

  // This is a basic, hardcoded session for development purposes.
  // It simulates a logged-in user with a specific ID.
  context.locals.session = {
    user: { id: "9c103c05-64ff-466c-a64b-1f490f3593a5" },
  };

  return next();
});
