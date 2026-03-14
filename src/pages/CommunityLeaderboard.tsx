import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { ContributorLeaderboard } from "@/components/community/ContributorLeaderboard";

export default function CommunityLeaderboard() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Community", url: "/community/setups" },
    { name: "Leaderboard", url: "/community/leaderboard" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Top Contributors"
        description="Community leaderboard – top contributors by reviews, votes, and proposals."
        canonical="/community/leaderboard"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Contributor Leaderboard</h1>
        <ContributorLeaderboard limit={20} className="max-w-2xl" />
      </main>
      <Footer />
    </div>
  );
}
