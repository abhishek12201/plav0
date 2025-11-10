'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
)

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21.4 10.9c0-1.2-.1-2.3-.3-3.4H12v6.4h5.3c-.2 2.1-1.6 3.9-3.4 5.1v4.1h5.3c3.1-2.9 4.9-7.1 4.9-12.2z" />
        <path d="M12 22c3.1 0 5.8-1 7.7-2.8l-5.3-4.1c-1 .7-2.4 1.1-3.9 1.1-3.1 0-5.7-2.1-6.6-4.9H3.3v4.1C5.2 19.1 8.3 22 12 22z" />
        <path d="M5.4 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1V5.9H3.3c-1.2 2.3-1.9 4.9-1.9 7.9s.7 5.6 1.9 7.9l2.1-4.1z" />
        <path d="M12 5.4c1.6 0 3.1.6 4.3 1.8l4.5-4.5C18.8 1.4 15.6 0 12 0 8.3 0 5.2 2.9 3.3 6.8l2.1 4.1c.9-2.8 3.5-4.9 6.6-4.9z" />
    </svg>
)


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [resetEmail, setResetEmail] = useState("");

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, authProvider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: `A reset link has been sent to ${resetEmail}.`,
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="text-center">
        <Link href="/" className="mb-4 inline-block">
            <Logo />
        </Link>
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your personalized learning hub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSocialLogin('github')}>
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" onClick={() => handleSocialLogin('google')}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="link" type="button" className="ml-auto p-0 h-auto text-sm text-primary">
                      Forgot password?
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Forgot Your Password?</AlertDialogTitle>
                      <AlertDialogDescription>
                        No problem. Enter your email address below and we&apos;ll send you a link to reset your password.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="m@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
