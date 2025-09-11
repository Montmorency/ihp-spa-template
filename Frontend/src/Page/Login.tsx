import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Login() {
    const appIcon = 'http://ihp.digitallyinduced.com/ihp.svg';
    return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 flex-grow-1">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <a href="#" className="flex items-center gap-2 self-center font-medium">
                <img src={appIcon} style={{height: '4rem'}}/>
            </a>
            <LoginForm />
        </div>
    </div>
}

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setLoading] = React.useState(false);
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your email address and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">

                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Continue with
                            </span>
                        </div>
                        <form action="/CreateSession" method="POST" onSubmit={() => setLoading(true)}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        name="email"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            to="/forgot-password"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <Input id="password" type="password" required name="password" autoComplete="password" />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    Login
                                </Button>
                            </div>
                        </form>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/NewUser" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="/terms-of-service" target="blank">Terms of Service</a>{" "}
                and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
            </div>
        </div>
    )
}