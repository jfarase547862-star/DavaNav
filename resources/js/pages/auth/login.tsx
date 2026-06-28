import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/Checkbox";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("admin@navix.gov");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  function validate() {
    const e: typeof errors = {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 4) e.password = "At least 4 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    router.post('/login', { email, password, remember });
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #dce8f5 0%, #eef2f8 50%, #f5f0ee 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to visitor site
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-xl">
          {/* Icon + heading */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "#0f3d95" }}
            >
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="mt-1 text-sm text-gray-400">Navix Solution · Davao City Hall</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@navix.gov"
                aria-invalid={!!errors.email}
                className="h-10 rounded-lg border-gray-200 bg-white text-sm focus:border-[#1a56c4] focus:ring-[#1a56c4]/20"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="h-10 rounded-lg border-gray-200 bg-white pr-9 text-sm focus:border-[#1a56c4] focus:ring-[#1a56c4]/20"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm text-[#1a56c4] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-[15px] font-semibold text-white"
              style={{ backgroundColor: "#0f3d95" }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">
              Demo: any email and a password of 4+ characters will sign you in.
            </p>
          </form>
        </div>
      </div>

      {/* Forgot password dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Enter your email and we'll send you a reset link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@navix.gov"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForgotOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
                  toast.error("Enter a valid email");
                  return;
                }
                toast.success("Reset link sent", {
                  description: `Check ${forgotEmail} for instructions.`,
                });
                setForgotOpen(false);
                setForgotEmail("");
              }}
            >
              Send reset link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}