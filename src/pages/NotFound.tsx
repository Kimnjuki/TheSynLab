import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MetaTags } from "@/components/seo/MetaTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NotFound = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularLinks = [
    { label: "Tool Reviews", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Comparisons", href: "/compare" },
    { label: "Best AI Writing Tools", href: "/best/ai-writing-tools" },
    { label: "ClickUp vs Todoist", href: "/vs/clickup-vs-todoist" },
    { label: "Stack Quiz", href: "/stack-quiz" },
    { label: "TCO Calculator", href: "/tco-calculator" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-xl text-center">
        <MetaTags title="Page Not Found | TheSynLab" description="The page you are looking for does not exist." canonical="" noindex />
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) window.location.href = `/tools?search=${encodeURIComponent(query.trim())}`;
          }}
        >
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools and reviews…"
            className="flex-1"
            aria-label="Search TheSynLab"
          />
          <Button type="submit">Search</Button>
        </form>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="text-primary underline hover:text-primary/90">Return to Home</Link>
          {popularLinks.map((l) => (
            <Link key={l.href} to={l.href} className="text-primary underline hover:text-primary/90">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
