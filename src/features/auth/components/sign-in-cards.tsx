import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";
import { SignInFlow } from "../types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

interface SignInCardsProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCards = ({ setState }: SignInCardsProps) => {
  const schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(1, "Password must be at least 1 characters")
      .max(256, "Password must be at best 256 characters"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (values: z.infer<typeof schema>) => {
    setIsPending(true);
    signIn("password", {
      email: values.email,
      password: values.password,
      flow: "signIn",
    })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const { signIn } = useAuthActions();
  const handleProviderSingIn = (value: "github" | "google") => {
    setIsPending(true);
    signIn(value).finally(() => {
      setIsPending(false);
    });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-700">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-700">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full "
              size="lg"
              disabled={isPending}
            >
              Continue
            </Button>
          </form>
        </Form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isPending}
            onClick={() => handleProviderSingIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>

          <Button
            disabled={isPending}
            onClick={() => handleProviderSingIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signup")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
