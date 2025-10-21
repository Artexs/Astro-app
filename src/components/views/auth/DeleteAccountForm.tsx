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

export default function DeleteAccountForm() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
           <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password-confirm">To confirm, type your password</Label>
              <Input id="password-confirm" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="destructive">Delete Account</Button>
      </CardFooter>
    </Card>
  );
}
