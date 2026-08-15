import { Link } from "react-router-dom";

const TrustDisclosure = () => {
  return (
    <section className="bg-tsl-bg-secondary py-12 md:py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm md:text-base text-tsl-text-secondary leading-relaxed">
            TheSynLab is funded through affiliate commissions and advertising. When you click product links and make a purchase, we may earn a commission at no additional cost to you. This never influences our scores — see our{" "}
            <Link to="/editorial" className="text-tsl-accent hover:underline font-medium">
              full Affiliate Disclosure
            </Link>{" "}
            and{" "}
            <Link to="/about" className="text-tsl-accent hover:underline font-medium">
              editorial policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustDisclosure;
