import { Link } from "react-router-dom";
import { Info } from "lucide-react";

interface Props {
  className?: string;
}

const AffiliateDisclosureBanner = ({ className = "" }: Props) => {
  return (
    <div className={`flex items-start gap-2 px-4 py-3 rounded-lg bg-muted/50 border text-sm text-muted-foreground ${className}`}>
      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <p>
        TheSynLab earns a commission if you click and purchase. This never affects our scores or recommendations.{" "}
        <Link to="/how-we-make-money" className="underline underline-offset-2 hover:text-foreground">
          Read our editorial policy →
        </Link>
      </p>
    </div>
  );
};

export default AffiliateDisclosureBanner;
