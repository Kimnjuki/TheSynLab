import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, UserCircle, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { VerifiedBadge } from "@/components/auth/VerifiedBadge";
import { useEmailVerification } from "@/hooks/useEmailVerification";

type NavLink = {
  name: string;
  href: string;
  items?: { name: string; href: string }[];
};

const navLinks: NavLink[] = [
  {
    name: "Reviews",
    href: "/tools",
    items: [
      { name: "Browse All Tools", href: "/tools" },
      { name: "AI & Productivity", href: "/hubs?tag=ai-tools" },
      { name: "Smart Home", href: "/hubs?tag=intelligent-home" },
      { name: "Hybrid Office", href: "/hubs?tag=hybrid-office" },
      { name: "Trending", href: "/tools?sort=trending" },
      { name: "Recently Updated", href: "/tools?sort=updated" },
    ],
  },
  {
    name: "Decide",
    href: "/compare",
    items: [
      { name: "Compare Tools", href: "/compare" },
      { name: "TCO Calculator", href: "/tools/budget-calculator" },
      { name: "Vendor Risk Checker", href: "/tools/vendor-risk" },
      { name: "Decision Studio", href: "/decision-studio" },
    ],
  },
  {
    name: "Build My Stack",
    href: "/stack-quiz",
    items: [
      { name: "Stack Quiz", href: "/stack-quiz" },
      { name: "AI Stack Architect", href: "/ai/stack-architect" },
      { name: "My Stack", href: "/my-stack" },
      { name: "Workflow Blueprints", href: "/workflows" },
    ],
  },
  {
    name: "Learn",
    href: "/scoring-hub",
    items: [
      { name: "Buying Guides", href: "/blog?type=guide" },
      { name: "Scoring Hub", href: "/scoring-hub" },
      { name: "Blog", href: "/blog" },
      { name: "About", href: "/about" },
    ],
  },
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
    const path = href.includes("?") ? href.split("?")[0] : href;
    return location.pathname === path || location.pathname.startsWith(path + "/");
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
                <div key={link.name} className="relative group">
                  <Link
                    to={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1",
                      isActiveLink(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                    {link.items && link.items.length > 0 && (
                      <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                    {isActiveLink(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                  {link.items && link.items.length > 0 && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <div className="bg-card border rounded-xl shadow-xl p-2 min-w-[220px] backdrop-blur-sm">
                        {link.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                      <div key={link.name}>
                        <div className="px-6 py-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {link.name}
                          </p>
                        </div>
                        {(link.items || [{ name: link.name, href: link.href }]).map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-6 py-3 text-sm transition-colors",
                              isActiveLink(item.href)
                                ? "text-primary bg-primary/5 border-r-2 border-primary"
                                : "text-foreground/70 hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {item.name}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
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
