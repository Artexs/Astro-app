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

export default function ResetPasswordForm() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Enter your new password" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your new password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Reset Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
