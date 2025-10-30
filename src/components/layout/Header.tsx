import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabaseClient } from "@/db/supabase.client";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const AuthenticatedNavigation: React.FC = () => (
    <>
      <Button asChild variant="default" size="lg">
        <a href="/create">Create</a>
      </Button>
      <Button asChild variant="default" size="lg">
        <a href="/my-cards">My Cards</a>
      </Button>
      <Button asChild variant="default" size="lg">
        <a href="/study">Study</a>
      </Button>
    </>
  );

  const AuthenticatedUserAccount: React.FC = () => {
    const handleLogout = async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (!error) {
        window.location.href = "/login";
      } else {
        console.error("Error logging out:", error.message);
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <img src="/placeholder-user.jpg" width={32} height={32} className="rounded-full sr-only" alt="Avatar" />
            <span>Account</span>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/account">Account</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const UnauthenticatedLinks: React.FC = () => (
    <>
      <Button asChild variant="default" size="default">
        <a href="/login">Login</a>
      </Button>
      <Button asChild variant="default" size="default">
        <a href="/register">Sign Up</a>
      </Button>
      <Button asChild variant="default" size="default">
        <a href="/forgot-password">Forgot Password</a>
      </Button>
    </>
  );

  const NavigationLinks: React.FC = () => (
    <>
      {isAuthenticated ? (
        <>
          <AuthenticatedNavigation />
          <AuthenticatedUserAccount />
        </>
      ) : (
        <UnauthenticatedLinks />
      )}
    </>
  );

  return (
    <header className="bg-background/50 backdrop-blur-lg border-b px-4 md:px-6 h-16 flex items-center justify-center">
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Button asChild variant="default" size="lg">
          <a href="/">Home</a>
        </Button>
        <NavigationLinks />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-4 p-4">
            <Button asChild variant="default" size="lg">
              <a href="/">Home</a>
            </Button>
            <NavigationLinks />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
