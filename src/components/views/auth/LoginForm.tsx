import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back. Please log in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Login</Button>
          <div className="text-sm text-muted-foreground">
            <a href="/forgot-password" className="underline">Forgot password?</a>
          </div>
          <div className="text-sm text-muted-foreground">
            Don't have an account? <a href="/register" className="underline">Sign up</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
