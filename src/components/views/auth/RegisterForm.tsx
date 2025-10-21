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

export default function RegisterForm() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email and password to get started.</CardDescription>
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
               <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Create Account</Button>
          <div className="text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="underline">Log in</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
