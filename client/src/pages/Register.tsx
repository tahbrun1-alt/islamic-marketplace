import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const returnPath = new URLSearchParams(window.location.search).get("return") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
        return;
      }
      await utils.auth.me.invalidate();
      toast.success("Account created! Welcome to Noor Marketplace.");
      navigate(returnPath);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-serif text-3xl font-bold text-gold-700 tracking-wide cursor-pointer">
              نور
            </span>
            <span className="font-serif text-3xl font-bold text-ink-800 ml-2 cursor-pointer">
              Noor Marketplace
            </span>
          </Link>
          <p className="text-ink-500 mt-2 text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-8">
          <h1 className="text-2xl font-serif font-bold text-ink-800 mb-6">Join Noor Marketplace</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-ink-700 font-medium">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10 border-cream-300 focus:border-gold-500"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-ink-700 font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 border-cream-300 focus:border-gold-500"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-ink-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-cream-300 focus:border-gold-500"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-ink-700 font-medium">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10 border-cream-300 focus:border-gold-500"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold py-2.5 rounded-xl transition-all"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating account...</>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-ink-400 text-xs text-center mt-4">
            By registering you agree to our{" "}
            <Link href="/terms" className="text-gold-600 hover:underline">Terms & Conditions</Link>
          </p>

          <div className="mt-6 text-center">
            <p className="text-ink-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-gold-600 hover:text-gold-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Islamic quote */}
        <p className="text-center text-ink-400 text-xs mt-6 italic">
          "The best of people are those who are most beneficial to people." — Prophet Muhammad ﷺ
        </p>
      </motion.div>
    </div>
  );
}
