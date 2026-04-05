import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === "admin@cbt.com");

    if (adminExists) {
      return new Response(JSON.stringify({ message: "Admin already exists" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create admin user
    const { data: adminUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@cbt.com",
      password: "admin123456",
      email_confirm: true,
      user_metadata: { name: "Administrator" },
    });

    if (createError) throw createError;

    // Set admin role (trigger creates 'user' role, so update it)
    await supabaseAdmin
      .from("user_roles")
      .update({ role: "admin" })
      .eq("user_id", adminUser.user.id);

    // Also insert admin role if update didn't match
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: adminUser.user.id, role: "admin" }, { onConflict: "user_id,role" });

    // Seed categories
    const { data: cats } = await supabaseAdmin.from("categories").insert([
      { name: "JLPT", description: "Japanese Language Proficiency Test", icon: "🎌", parent_id: null },
      { name: "JFT Basic", description: "Japan Foundation Test for Basic Japanese", icon: "📘", parent_id: null },
      { name: "SSW", description: "Specified Skilled Worker", icon: "🏭", parent_id: null },
    ]).select();

    if (cats && cats.length >= 1) {
      // Add sub-categories for JLPT
      const jlptId = cats[0].id;
      await supabaseAdmin.from("categories").insert([
        { name: "JLPT N5", description: "Level N5 - Pemula", icon: "📗", parent_id: jlptId },
        { name: "JLPT N4", description: "Level N4 - Dasar", icon: "📙", parent_id: jlptId },
        { name: "JLPT N3", description: "Level N3 - Menengah", icon: "📕", parent_id: jlptId },
      ]);
    }

    return new Response(JSON.stringify({ message: "Admin created and data seeded successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
