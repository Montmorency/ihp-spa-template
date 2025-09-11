import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Flex, Spinner } from "@radix-ui/themes"
import { useGoogleLogin } from "@react-oauth/google"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function NewUser() {
    const appIcon = "http://ihp.digitallyinduced.com/ihp.svg"
    return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 flex-grow-1">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <a href="#" className="flex items-center gap-2 self-center font-medium">
                <img src={appIcon} style={{height: '4rem'}}/>
            </a>
            <NewUserForm />
        </div>
    </div>
}

export function NewUserForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setIsLoading(true);
        const form = event.currentTarget;
        const data = new FormData(form);
        const email = data.get('email')?.toString();

        const isGmail = email?.endsWith('@gmail.com');
        if (isGmail) {
            alert('Please use connect with google to sign up with your Gmail account');
            setIsLoading(false);
            return;
        }

        fetch('/CreateUser', { body: data, method: 'POST' })
            .then(res => res.json())
            .then(() => {
                navigate('/NewSession');
            })
    }, []);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sign up</CardTitle>
                    <CardDescription>
                        Sign up with your Google or Microsoft account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Continue with email and password
                            </span>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-6">

                                <Flex gap="2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstname">First Name</Label>
                                        <Input
                                            id="firstname"
                                            placeholder="John"
                                            required
                                            name="firstname"
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input
                                            id="lastname"
                                            placeholder="Doe"
                                            required
                                            name="lastname"
                                            autoComplete="family-name"
                                        />
                                    </div>
                                </Flex>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="me@example.com"
                                        required
                                        name="email"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" required name="passwordHash" autoComplete="new-password" />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    Sign up
                                </Button>
                            </div>
                        </form>
                        <div className="text-center text-sm">
                            Already have an account? {" "}
                            <Link to="/NewSession" className="underline underline-offset-4">
                                Login
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
