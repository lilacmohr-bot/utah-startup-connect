import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — 5iO" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav({ to: "/dashboard" });
  }, [user, nav]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "var(--font-body)" }}>
      <SiteNav />
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your 5iO account.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" onClick={onGoogle} className="w-full">
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/auth/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}