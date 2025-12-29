'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/actions';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const { setToken } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await register(formData);

        if (result?.success && result.token) {
            setToken(result.token);
            toast({
                title: 'Account created!',
                description: 'Welcome to Event Go!',
            });
            router.push('/');
            router.refresh();
        } else {
             setError(result?.message || 'An unknown error occurred.');
        }

        setIsPending(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
            <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Max Robinson" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? 'Creating Account...' : 'Create an account'}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary">
                Sign in
                </Link>
            </div>
            </CardContent>
        </Card>
        </div>
    );
}
