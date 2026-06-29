import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dashboardUrl = "/login";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    dashboardUrl = profile?.role === "admin" ? "/admin" : "/fundraiser";
  }

  return (
    <nav className="w-full top-0 sticky bg-surface border-b border-outline-variant z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3 max-w-container-max mx-auto">
        <div className="flex items-center gap-stack-lg">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
            Donate Now
          </Link>
          <div className="hidden md:flex items-center space-x-gutter">
            <Link
              href="#"
              className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 hover:text-primary transition-colors"
            >
              Browse
            </Link>
            <Link
              href="#"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Start a Fundraiser
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-stack-md">
          {user ? (
            <Link
              href={dashboardUrl}
              className="bg-primary text-white font-label-sm text-label-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-md cursor-pointer text-center font-semibold"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block font-label-sm text-label-sm text-primary px-4 py-2 hover:opacity-80 transition-all cursor-pointer font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white font-label-sm text-label-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-md cursor-pointer text-center font-semibold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
