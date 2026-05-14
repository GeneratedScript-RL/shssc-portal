import { redirect } from "next/navigation";
import UserBadge from "@/components/shared/UserBadge";
import { getSession } from "@/lib/auth/getSession";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/queries";

export default async function MyProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const supabase = createServiceRoleClient();
  const { data: user } = await supabase.from("users").select("id").eq("auth_id", session.user.id).maybeSingle();

  if (!user?.id) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile(user.id);

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="container py-10">
      <div className="panel-hero">
        <UserBadge userId={profile.id} size="lg" />
        <p className="mt-6 text-sm text-muted-foreground">Email: {profile.email}</p>
        <p className="mt-2 text-sm text-muted-foreground">Access level: {profile.access_level?.name ?? "Student"}</p>
      </div>
    </div>
  );
}
