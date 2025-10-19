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
// import { createClient } from '@/db/supabase.client';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  // const supabase = createClient();

  const handleLogout = async () => {
    // const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/login";
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <header className="bg-background border-b px-4 md:px-6 h-16 flex items-center justify-between">
      <a className="flex items-center gap-2" href="/">
        <span className="font-semibold text-lg">Flashcards</span>
      </a>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {isAuthenticated ? (
          <>
            <a className="text-foreground hover:text-foreground/80" href="/create">
              Create
            </a>
            <a className="text-foreground hover:text-foreground/80" href="/my-cards">
              My Cards
            </a>
            <a className="text-foreground hover:text-foreground/80" href="/study">
              Study
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img src="/placeholder-user.jpg" width={32} height={32} className="rounded-full" alt="Avatar" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <a className="text-foreground hover:text-foreground/80" href="/login">
              Login
            </a>
            <a
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
              href="/signup"
            >
              Sign Up
            </a>
          </>
        )}
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
            {isAuthenticated ? (
              <>
                <a className="text-foreground hover:text-foreground/80" href="/create">
                  Create
                </a>
                <a className="text-foreground hover:text-foreground/80" href="/my-cards">
                  My Cards
                </a>
                <a className="text-foreground hover:text-foreground/80" href="/study">
                  Study
                </a>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <img src="/placeholder-user.jpg" width={32} height={32} className="rounded-full" alt="Avatar" />
                      My Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <a className="text-foreground hover:text-foreground/80" href="/login">
                  Login
                </a>
                <a
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
                  href="/signup"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
