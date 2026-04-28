import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, UserCircle, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { VerifiedBadge } from "@/components/auth/VerifiedBadge";
import { useEmailVerification } from "@/hooks/useEmailVerification";

const navLinks = [
  { name: "Hubs", href: "/hubs" },
  { name: "Compare", href: "/compare" },
  { name: "Stack Builder", href: "/stack-builder" },
  { name: "Decision Studio", href: "/decision-studio" },
  { name: "Workflows", href: "/workflows" },
  { name: "Scoring Hub", href: "/scoring-hub" },
  { name: "Blog", href: "/blog" },
];

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { showBanner, dismissBanner, email, isVerified } = useEmailVerification();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
    setMobileMenuOpen(false);
  };

  const isActiveLink = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-2 text-center text-sm">
        <div className="container flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>New: Integration Pro membership now available!</span>
          <Link to="/pricing" className="underline hover:no-underline font-medium">
            Learn more →
          </Link>
        </div>
      </div>

      {/* Email Verification Banner */}
      {showBanner && (
        <div className="container py-2">
          <EmailVerificationBanner email={email} onDismiss={dismissBanner} />
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b shadow-sm h-14"
            : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b h-16"
        )}
      >
        <div className="container flex h-full items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className={cn(
                  "rounded-lg bg-gradient-to-br from-primary to-secondary transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25",
                  isScrolled ? "h-7 w-7" : "h-8 w-8"
                )}
              />
              <span
                className={cn(
                  "font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300",
                  isScrolled ? "text-lg" : "text-xl"
                )}
              >
                TheSynLab
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActiveLink(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                  {isActiveLink(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <CommandPalette />
            <NotificationsDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onClearAll={clearAll}
            />
            {user && (
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </span>
                {isVerified && <VerifiedBadge variant="compact" />}
              </div>
            )}
            {user && (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            )}
            <Button
              variant={user ? "ghost" : "default"}
              size="sm"
              className="hidden md:flex gap-2"
              onClick={handleAuthAction}
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
                      <span className="text-xl font-bold">TheSynLab</span>
                    </div>
                  </div>

                  <nav className="flex-1 py-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-6 py-4 text-lg font-medium transition-colors",
                          isActiveLink(link.href)
                            ? "text-primary bg-primary/5 border-r-2 border-primary"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {link.name}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    ))}
                  </nav>

                  <div className="p-6 border-t space-y-3">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                          {isVerified && <VerifiedBadge variant="compact" />}
                        </div>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full gap-2">
                            <UserCircle className="h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full gap-2"
                          onClick={handleAuthAction}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full gap-2" onClick={handleAuthAction}>
                        <User className="h-4 w-4" />
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
