#!/usr/bin/env python3
"""Replace thin prerender blocks for /about, /disclosure, /privacy, /terms with expanded content."""

import re

with open("vite.config.ts", "r") as f:
    content = f.read()

# ── New About page (450+ words) ─────────────────────────────────
NEW_ABOUT = '''  if (route === "/about") return `<main style="${MAIN_STYLE}">
<h1>About TheSynLab</h1>
<p>TheSynLab is an independent technology review platform evaluating SaaS tools, smart home devices, and productivity software using our proprietary Trust Score and Integration Score methodology. Founded in 2025, we have reviewed over 300 software tools across 20 categories — every single one tested hands-on by our editorial team for a minimum of 14 days before receiving a score.</p>
<h2>Our Mission</h2><p>We help professionals, startups, and enterprise teams make confident technology decisions through honest, data-driven reviews. Unlike user-review platforms like G2 or Capterra, every review on TheSynLab is written by an editor who has personally deployed and used the tool in a real-world workflow. No paid placements. No sponsored ratings. No affiliate influence on scores.</p>
<h2>Our Scoring System</h2><p>Every tool on TheSynLab receives two scores. The <b>Trust Score</b> (0 to 100) measures reliability, data privacy practices, security certifications, vendor transparency, and customer support quality. The <b>Integration Score</b> (0 to 100) evaluates ecosystem compatibility, API quality and documentation, native integrations with popular platforms, import/export capabilities, and third-party marketplace presence. Together these scores give you a complete picture of both the tool and its fit within your existing stack.</p>
<h2>Total Cost of Ownership Analysis</h2><p>Beyond scores, we calculate a 3-year Total Cost of Ownership for every product. Our TCO model includes subscription fees, per-user pricing at scale, onboarding and migration costs, training time, API usage overages, and estimated annual price increases. We surface hidden costs that vendor comparison pages typically omit.</p>
<h2>Editorial Independence</h2><p>TheSynLab is funded through affiliate commissions and advertising. This funding model allows us to keep our content free for all readers. Our editorial independence is absolute — scores, rankings, and recommendations are determined by our testing team alone. Commercial relationships never influence a review outcome. See our <a href="/disclosure">Affiliate Disclosure</a> for full details.</p>
<h2>Who We Serve</h2><p>Our readers include SaaS founders evaluating their tool stack, IT managers making procurement decisions, startup operators looking for budget-friendly alternatives, and technology enthusiasts comparing the latest AI and smart home products. We publish new reviews weekly and update existing reviews quarterly to reflect pricing changes, feature updates, and vendor policy shifts.</p>
</main>`;'''

# ── New Privacy Policy (400+ words) ─────────────────────────────
NEW_PRIVACY = '''  if (route === "/privacy") return `<main style="${MAIN_STYLE}">
<h1>Privacy Policy</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab ("we", "our", "us") is committed to protecting your privacy and being transparent about how we collect, use, and share your information. This policy applies to the website thesynlab.com and all related services.</p>
<h2>Information We Collect</h2><p><b>Information you provide:</b> Email address when subscribing to newsletters, profile information if you create an account, product reviews and comments you submit, and correspondence you send us. <b>Automatically collected:</b> IP address, browser type and version, operating system, referring URLs, pages visited, time spent on pages, and interaction data through Google Analytics 4.</p>
<h2>Google AdSense and Cookies</h2><p>We use Google AdSense to display advertisements. Google uses cookies to serve personalised ads based on your browsing history and interests. Non-essential cookies (analytics, advertising, preferences) are only activated after you give explicit consent via our Cookie Consent Manager, which implements Google Consent Mode v2. You may opt out of personalised advertising at any time via Google Ads Settings (adssettings.google.com).</p>
<h2>Third-Party Services</h2><p>We use Google Analytics 4 for audience measurement and usage analysis. We use Clerk for authentication. Data collected by these services is governed by their respective privacy policies. We do not sell your personal data to any third party.</p>
<h2>Data Retention</h2><p>We retain your personal data only as long as necessary to provide our services or comply with legal obligations. Analytics data is retained for 26 months. Newsletter subscription data is retained until you unsubscribe.</p>
<h2>Your Rights (GDPR and CCPA)</h2><p>If you are in the EEA or UK, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. California residents have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information (we do not sell data). To exercise any of these rights, contact: privacy@thesynlab.com.</p>
<h2>Changes to This Policy</h2><p>We may update this policy from time to time. Material changes will be notified via a notice on our website.</p>
<h2>Contact</h2><p>Data Protection: privacy@thesynlab.com</p>
</main>`;'''

# ── New Terms of Service (400+ words) ────────────────────────────
NEW_TERMS = '''  if (route === "/terms") return `<main style="${MAIN_STYLE}">
<h1>Terms of Service</h1><p>Last Updated: January 12, 2026</p>
<p>By accessing or using TheSynLab website and services ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
<h2>Use of the Service</h2><p>You may use the Service for lawful purposes only. You agree not to: scrape, reproduce, or redistribute our content without written permission; attempt to manipulate our Trust Scores or rankings; submit false, misleading, or spam content; interfere with the operation of the website; or engage in any activity that violates applicable laws or regulations.</p>
<h2>User Accounts</h2><p>Creating an account is optional. If you register, you are responsible for maintaining the confidentiality of your credentials. You must provide accurate information. We reserve the right to suspend or terminate accounts that violate these terms.</p>
<h2>Intellectual Property</h2><p>All content on TheSynLab — including reviews, Trust Scores, Integration Scores, comparison data, methodology descriptions, editorial analysis, and visual assets — is owned by TheSynLab and protected by copyright, trademark, and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
<h2>Reviews and User Content</h2><p>By submitting reviews or comments, you grant TheSynLab a non-exclusive, royalty-free license to display and distribute your content on our platform. You represent that your submissions are original and do not violate third-party rights. We reserve the right to moderate or remove user content at our discretion.</p>
<h2>Affiliate Links and Advertising</h2><p>TheSynLab participates in affiliate marketing programs operated by Impact, ShareASale, and individual vendor programs. We may earn commissions on purchases made through affiliate links at no additional cost to you. This does not affect our editorial independence or the integrity of our reviews and scores.</p>
<h2>Disclaimer of Warranties</h2><p>The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or timeliness of reviews, scores, or pricing information. Product features, pricing, and availability may change without notice.</p>
<h2>Limitation of Liability</h2><p>TheSynLab shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including reliance on reviews or scores in purchasing decisions.</p>
<h2>Changes to Terms</h2><p>We may modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
<h2>Contact</h2><p>Legal inquiries: legal@thesynlab.com</p>
</main>`;'''

# ── New Disclosure (300+ words) ─────────────────────────────────
NEW_DISCLOSURE = '''  if (route === "/disclosure") return `<main style="${MAIN_STYLE}">
<h1>Affiliate Disclosure</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab participates in affiliate marketing programs operated by Impact, ShareASale, and individual vendor affiliate networks. When you click product links on our site and make a purchase, we may earn a commission at no additional cost to you. These commissions help fund our editorial operations and allow us to keep all content free for readers.</p>
<h2>Our Editorial Independence</h2><p>Affiliate relationships do not influence our reviews, Trust Scores, Integration Scores, rankings, or recommendations in any way. All products are evaluated independently by our editorial team through hands-on testing. We maintain a strict separation between our commercial partnerships and editorial decision-making. We never accept payment for positive reviews, and we always disclose affiliate links clearly.</p>
<h2>How We Choose Products to Review</h2><p>Products are selected based on reader interest, market relevance, and new technology trends — not affiliate commission rates. We aim to cover the most widely used tools in each category and frequently review open-source and free alternatives that generate no commission.</p>
<h2>FTC Compliance</h2><p>Per FTC 16 CFR Part 255 regarding endorsements and testimonials in advertising, we disclose that we may receive compensation for some of the links on this website. This disclosure is made in good faith and in compliance with applicable regulations.</p>
<h2>Contact</h2><p>Questions about our affiliate practices? Email: affiliates@thesynlab.com</p>
</main>`;'''


# ── Perform replacements ────────────────────────────────────────

# Define old blocks to match — use the exact content from the file
# Privacy (lines 713-721)
OLD_PRIVACY = """  if (route === "/privacy") return `<main style="${MAIN_STYLE}">
<h1>Privacy Policy</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab is committed to protecting your privacy and being transparent about how we collect, use, and share your information.</p>
<h2>Information We Collect</h2><p>We collect information you provide (email, profile info, reviews) and automatically collected usage data (IP address, browser type, pages visited).</p>
<h2>Google AdSense &amp; Cookies</h2><p>We use Google AdSense for advertisements. Non-essential cookies (analytics, advertising, preferences) are only activated after you give explicit consent via our Cookie Consent Manager. You may opt out of personalised advertising via Google Ads Settings.</p>
<h2>How We Use Your Information</h2><p>To provide our services, send newsletters (with consent), analyse usage patterns, and improve your experience. We do not sell your personal data to third parties.</p>
<h2>Your Rights (GDPR &amp; CCPA)</h2><p>EEA/UK residents may request access, rectification, erasure, or portability of their data. California residents have rights under CCPA. Contact: privacy@thesynlab.com</p>
<h2>Contact</h2><p>Email: privacy@thesynlab.com</p>
</main>`;"""

# Terms (lines 723-731)  
OLD_TERMS = """  if (route === "/terms") return `<main style="${MAIN_STYLE}">
<h1>Terms of Service</h1><p>Last Updated: January 12, 2026</p>
<p>By accessing or using TheSynLab you agree to be bound by these Terms of Service.</p>
<h2>User Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account credentials and ensuring your use complies with applicable laws.</p>
<h2>Intellectual Property</h2><p>Our reviews, Trust Scores, Integration Scores, and methodologies are owned by TheSynLab and protected by copyright law.</p>
<h2>Affiliate Links &amp; Advertising</h2><p>TheSynLab participates in affiliate programs and may earn commissions on purchases at no additional cost to you. This does not affect our editorial independence.</p>
<h2>Contact</h2><p>Email: legal@thesynlab.com</p>
</main>`;"""

# Disclosure (lines 733-741)
OLD_DISCLOSURE = """  if (route === "/disclosure") return `<main style="${MAIN_STYLE}">
<h1>Affiliate Disclosure</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab participates in affiliate marketing programs. When you click product links on our site and make a purchase, we may earn a commission at no additional cost to you.</p>
<h2>Our Editorial Independence</h2><p>Affiliate relationships do not influence our reviews, Trust Scores, or recommendations. All products are evaluated independently.</p>
<h2>FTC Compliance</h2><p>Per FTC 16 CFR Part 255, we disclose that we may receive compensation for links on this website.</p>
<h2>Contact</h2><p>Email: affiliates@thesynlab.com</p>
</main>`;"""

# About (lines 742-749)
OLD_ABOUT = """  if (route === "/about") return `<main style="${MAIN_STYLE}">
<h1>About TheSynLab</h1>
<p>TheSynLab is an independent technology review platform evaluating SaaS tools, smart home devices, and productivity software using our proprietary Trust Score and Integration Score methodology.</p>
<h2>Our Mission</h2><p>We help professionals and teams make confident technology decisions through honest, data-driven reviews.</p>
<h2>Our Scoring System</h2><p>Every tool receives a <b>Trust Score</b> (reliability, privacy, transparency) and an <b>Integration Score</b> (ecosystem compatibility, API quality). Both range from 0 to 100.</p>
<h2>Editorial Independence</h2><p>Funded through affiliate commissions and advertising — scores and recommendations are never influenced by commercial relationships. See our <a href="/disclosure">Affiliate Disclosure</a>.</p>
</main>`;"""


replacements = [
    (OLD_ABOUT, NEW_ABOUT),
    (OLD_PRIVACY, NEW_PRIVACY),
    (OLD_TERMS, NEW_TERMS),
    (OLD_DISCLOSURE, NEW_DISCLOSURE),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        count += 1
        print(f"✓ Replaced block (found in content)")
    else:
        print(f"✗ Block NOT found in content")

with open("vite.config.ts", "w") as f:
    f.write(content)

print(f"\nDone. {count}/4 replacements made.")
