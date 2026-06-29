import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Unauthenticated users trying to access protected areas
  if (!user) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/fundraiser") || pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // Fetch basic user profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role;

  // 2. ADMIN Routing Rules
  if (userRole === "admin") {
    // Prevent admin from accessing onboarding/blocked screens
    if (pathname.startsWith("/onboarding") || pathname === "/blocked" || pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  // 3. FUNDRAISER Routing Rules
  if (userRole === "fundraiser") {
    // Fetch fundraiser status & onboarding progress
    const { data: fundProfile } = await supabase
      .from("fundraiser_profiles")
      .select("verification_status, is_submitted, onboarding_step")
      .eq("id", user.id)
      .single();

    // Blocked state gets absolute priority
    const status = fundProfile?.verification_status;
    if (status === "blocked_temp" || status === "blocked_perm") {
      if (pathname !== "/blocked") {
        return NextResponse.redirect(new URL("/blocked", request.url));
      }
      return supabaseResponse;
    }

    // A user in blocked state is only allowed on /blocked
    if (pathname === "/blocked") {
      if (status !== "blocked_temp" && status !== "blocked_perm") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return supabaseResponse;
    }

    // Incomplete Onboarding State
    const hasStartedOnboarding = !!fundProfile;
    const isSubmitted = fundProfile?.is_submitted === true;

    if (!hasStartedOnboarding || !isSubmitted) {
      // Must be forced to onboarding wizard
      if (status === "rejected") {
        // If rejected, user is allowed to resubmit or view rejection info
        if (!pathname.startsWith("/onboarding/rejected") && !pathname.startsWith("/onboarding/step")) {
          return NextResponse.redirect(new URL("/onboarding/rejected", request.url));
        }
      } else {
        // Standard onboarding step flow
        if (!pathname.startsWith("/onboarding") || pathname.startsWith("/onboarding/pending") || pathname.startsWith("/onboarding/rejected")) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }
      return supabaseResponse;
    }

    // Awaiting Review (Pending / Under Review)
    if (status === "pending" || status === "under_review") {
      if (pathname !== "/onboarding/pending") {
        return NextResponse.redirect(new URL("/onboarding/pending", request.url));
      }
      return supabaseResponse;
    }

    // Rejected state redirection rules (if is_submitted is true but rejected)
    if (status === "rejected") {
      if (!pathname.startsWith("/onboarding/rejected") && !pathname.startsWith("/onboarding/step")) {
        return NextResponse.redirect(new URL("/onboarding/rejected", request.url));
      }
      return supabaseResponse;
    }

    // Approved Fundraiser State
    if (status === "approved") {
      // Prevent approved fundraiser from accessing onboarding/blocked/login screens
      if (pathname.startsWith("/onboarding") || pathname === "/blocked" || pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/fundraiser", request.url));
      }
      
      // If trying to access admin panel, kick to fundraiser panel
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/fundraiser", request.url));
      }
      
      return supabaseResponse;
    }
  }

  // Prevent logged-in users from accessing login/register pages
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block non-admins from admin panel
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}
