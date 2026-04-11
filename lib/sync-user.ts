import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const supabase = createAdminClient();

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("userId")
    .eq("userId", user.id)
    .single();

  if (!existingUser) {
    const { error } = await supabase.from("users").insert({
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Unknown",
    });

    if (error) {
      console.error("Error syncing user to Supabase:", error);
    }
  }

  return user;
}
