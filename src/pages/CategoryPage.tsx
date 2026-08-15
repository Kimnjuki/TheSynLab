import { useParams, Navigate } from "react-router-dom";

const CATEGORY_MAP: Record<string, string> = {
  "saas-dev": "/hub/ai-tools",
  "smart-home": "/hub/intelligent-home",
  "hybrid-office": "/hub/hybrid-office",
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const target = slug ? CATEGORY_MAP[slug] : null;

  if (!target) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={target} replace />;
};

export default CategoryPage;
