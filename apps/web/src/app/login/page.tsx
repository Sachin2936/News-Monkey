"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import ThreeBackground from "@/components/ThreeBackground";
import { Keyboard } from "lucide-react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <ThreeBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-primary/5 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-4 border border-primary/20 shadow-lg shadow-primary/10"
          >
            <Keyboard className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black font-outfit tracking-tight uppercase bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
          >
            News Monkey
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium mt-2"
          >
            Master your typing with real news articles
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Glassmorphic background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl" />

          {/* Form Content */}
          <div className="relative p-8">
            <AnimatePresence mode="wait">
              {showSignIn ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </div>
    </div>
  );
}
