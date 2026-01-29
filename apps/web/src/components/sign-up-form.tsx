import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { syncLocalHistoryToBackend } from "@/lib/sync-history";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: async () => {
            toast.success("Account created successfully!");
            // Sync any localStorage history to backend
            await syncLocalHistoryToBackend();
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  // Redirect if already logged in
  if (!isPending && session?.user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black font-outfit tracking-tight uppercase">
          Create Account
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Join News Monkey and start improving
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-4">
          <form.Field name="name">
            {(field) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Your name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="pl-11 py-6 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                  />
                </div>
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-400 text-xs font-medium">
                    {error?.message}
                  </p>
                ))}
              </motion.div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="pl-11 py-6 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                  />
                </div>
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-400 text-xs font-medium">
                    {error?.message}
                  </p>
                ))}
              </motion.div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="pl-11 py-6 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                  />
                </div>
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-400 text-xs font-medium">
                    {error?.message}
                  </p>
                ))}
              </motion.div>
            )}
          </form.Field>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                disabled={!state.canSubmit || state.isSubmitting}
                className="w-full py-6 rounded-2xl font-bold text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all group"
              >
                {state.isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </motion.div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-transparent text-muted-foreground font-medium">
            or
          </span>
        </div>
      </div>

      {/* Switch to Sign In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-primary hover:text-primary/80 font-bold transition-colors"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
}
