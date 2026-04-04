import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="container py-16">
      <div className="panel mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">403</p>
        <h1 className="mt-4 text-4xl font-semibold text-brand-green">You do not have access to this area.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The requested page is restricted to council members with the required permission level.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
