-- Ad Compliance System Tables

-- Ad submissions table
CREATE TABLE public.ad_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  destination_url TEXT,
  image_urls TEXT[],
  category TEXT,
  target_audience JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'requires_review', 'flagged')),
  compliance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Compliance violations table
CREATE TABLE public.ad_compliance_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES public.ad_submissions(id) ON DELETE CASCADE,
  violation_level INTEGER NOT NULL CHECK (violation_level BETWEEN 1 AND 4),
  violation_category TEXT NOT NULL,
  violation_rule TEXT NOT NULL,
  matched_keywords TEXT[],
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  description TEXT,
  ai_confidence NUMERIC(3,2),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance audit log
CREATE TABLE public.ad_compliance_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID REFERENCES public.ad_submissions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('system', 'ai', 'moderator', 'admin')),
  previous_status TEXT,
  new_status TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advertiser certifications table
CREATE TABLE public.advertiser_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  certification_type TEXT NOT NULL,
  certificate_number TEXT,
  issuing_authority TEXT,
  valid_from DATE,
  valid_until DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'revoked')),
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Policy rules configuration (for customization)
CREATE TABLE public.ad_policy_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id INTEGER NOT NULL CHECK (level_id BETWEEN 1 AND 4),
  level_name TEXT NOT NULL,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[],
  instruction TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  requires_certification BOOLEAN DEFAULT false,
  age_restriction INTEGER,
  geo_restrictions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_compliance_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertiser_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_policy_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ad_submissions
CREATE POLICY "Users can view their own ad submissions"
  ON public.ad_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create ad submissions"
  ON public.ad_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ad submissions"
  ON public.ad_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ad submissions"
  ON public.ad_submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for violations
CREATE POLICY "Users can view violations for their ads"
  ON public.ad_compliance_violations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ad_submissions 
    WHERE id = ad_id AND user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all violations"
  ON public.ad_compliance_violations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage violations"
  ON public.ad_compliance_violations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for audit log
CREATE POLICY "Admins can view audit log"
  ON public.ad_compliance_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for certifications
CREATE POLICY "Users can view their own certifications"
  ON public.advertiser_certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own certifications"
  ON public.advertiser_certifications FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certifications"
  ON public.advertiser_certifications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for policy rules (public read)
CREATE POLICY "Anyone can view active policy rules"
  ON public.ad_policy_rules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage policy rules"
  ON public.ad_policy_rules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_ad_submissions_user_id ON public.ad_submissions(user_id);
CREATE INDEX idx_ad_submissions_status ON public.ad_submissions(status);
CREATE INDEX idx_ad_violations_ad_id ON public.ad_compliance_violations(ad_id);
CREATE INDEX idx_ad_violations_severity ON public.ad_compliance_violations(severity);
CREATE INDEX idx_audit_log_ad_id ON public.ad_compliance_audit_log(ad_id);

-- Insert default policy rules from the guidelines
INSERT INTO public.ad_policy_rules (level_id, level_name, severity, category, keywords, instruction, requires_certification, age_restriction) VALUES
-- Level 1: Prohibited Content
(1, 'Prohibited Content', 'CRITICAL', 'Illegal Products & Services', 
  ARRAY['drugs', 'weapons', 'explosives', 'fake documents', 'malware', 'hacking software', 'tobacco', 'vapes'],
  'Flag any promotion, sale, or facilitation of illegal goods, recreational drugs, drug paraphernalia, weapons, ammunition, or tobacco products.', false, NULL),
(1, 'Prohibited Content', 'CRITICAL', 'Discriminatory Practices',
  ARRAY['race', 'ethnicity', 'religion', 'sexual orientation', 'no allowed', 'housing discrimination', 'employment discrimination'],
  'Flag content that discriminates against or incites hatred toward any group based on personal attributes.', false, NULL),
(1, 'Prohibited Content', 'CRITICAL', 'Adult Content & Nudity',
  ARRAY['pornography', 'sex toys', 'escort services', 'strip clubs', 'genitalia', 'excessive skin'],
  'Reject content showing explicit nudity, sexual acts, or excessive skin.', false, NULL),
(1, 'Prohibited Content', 'CRITICAL', 'Misinformation & Deception',
  ARRAY['fake news', 'deepfake', 'guaranteed cure', 'get rich quick', 'pyramid scheme', 'conspiracy theory'],
  'Reject false claims, doctored media, unrealistic health/financial promises, and multilevel marketing schemes.', false, NULL),
(1, 'Prohibited Content', 'CRITICAL', 'Counterfeit Goods',
  ARRAY['replica', 'knockoff', 'fake', 'imitation'],
  'Reject ads selling counterfeit or unauthorized replica goods that infringe on trademarks.', false, NULL),
(1, 'Prohibited Content', 'CRITICAL', 'Malicious Software',
  ARRAY['spyware', 'virus', 'unauthorized download', 'automatic download'],
  'Reject any destination URL that hosts malware or initiates unauthorized downloads.', false, NULL),

-- Level 2: Restricted Content
(2, 'Restricted Content', 'HIGH', 'Alcohol',
  ARRAY['beer', 'wine', 'spirits', 'liquor', 'cocktail'],
  'Ensure target audience is of legal drinking age (18+/21+) and complies with local laws.', false, 18),
(2, 'Restricted Content', 'HIGH', 'Gambling & Gaming',
  ARRAY['casino', 'betting', 'sportsbook', 'poker', 'lottery', 'social casino'],
  'Require proof of license/certification. Flag for age-gating (18+).', true, 18),
(2, 'Restricted Content', 'HIGH', 'Healthcare & Medicine',
  ARRAY['prescription', 'pharmacy', 'weight loss', 'clinical trial', 'botox', 'telehealth'],
  'Flag for review. Prescription drugs require certification (e.g., LegitScript).', true, NULL),
(2, 'Restricted Content', 'HIGH', 'Financial Services',
  ARRAY['crypto', 'loan', 'credit card', 'investment', 'forex'],
  'Require disclosure of fees, interest rates, and physical address.', true, NULL),
(2, 'Restricted Content', 'HIGH', 'Political & Social Issues',
  ARRAY['election', 'vote', 'candidate', 'social issue', 'legislation'],
  'Require Paid for by disclaimer and identity verification.', true, NULL),
(2, 'Restricted Content', 'HIGH', 'Dating Services',
  ARRAY['dating app', 'singles', 'meet people'],
  'Flag for Adult audience targeting only.', false, 18),

-- Level 3: Editorial Standards
(3, 'Editorial & Technical Standards', 'MEDIUM', 'Grammar & Professionalism',
  ARRAY['gimmicky text', 'all caps', 'excessive symbols', 'misspelling'],
  'Flag excessive capitalization, repeated punctuation, or substituting numbers for letters.', false, NULL),
(3, 'Editorial & Technical Standards', 'MEDIUM', 'Clickbait & Sensationalism',
  ARRAY['you wont believe', 'shocking', 'one weird trick', 'graphic violence'],
  'Flag sensationalist language or shocking imagery used to drive clicks.', false, NULL),
(3, 'Editorial & Technical Standards', 'MEDIUM', 'Personal Attributes',
  ARRAY['are you', 'do you suffer from', 'meet other'],
  'Flag text that directly asserts or implies a users personal attributes.', false, NULL),

-- Level 4: Destination & Landing Page
(4, 'Destination & Landing Page', 'MEDIUM', 'Functional Destination',
  ARRAY['404 error', 'broken link', 'under construction'],
  'Reject if the landing page does not load or returns an error code.', false, NULL),
(4, 'Destination & Landing Page', 'MEDIUM', 'Relevance & Consistency',
  ARRAY['bait and switch', 'mismatch'],
  'Ensure the product/service in the ad matches the landing page content.', false, NULL),
(4, 'Destination & Landing Page', 'MEDIUM', 'Transparency & Privacy',
  ARRAY['privacy policy', 'terms of service', 'cookie notice'],
  'Verify the landing page has a visible Privacy Policy link.', false, NULL);

-- Trigger to update updated_at
CREATE TRIGGER update_ad_submissions_updated_at
  BEFORE UPDATE ON public.ad_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();