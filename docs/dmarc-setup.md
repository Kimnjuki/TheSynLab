# DMARC, SPF & DKIM Setup for thesynlab.com

## Why
DMARC prevents email spoofing. Without it, attackers can send fake emails from @thesynlab.com that look legitimate. The audit flagged this as missing.

## DNS Records to Add

### 1. SPF Record (TXT record for thesynlab.com)
```
v=spf1 include:_spf.google.com include:mailgun.org ~all
```
This authorizes Google (for Gmail/G Suite) and Mailgun to send on your behalf.

### 2. DMARC Record (TXT record for _dmarc.thesynlab.com)
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@thesynlab.com; ruf=mailto:dmarc@thesynlab.com; pct=100; sp=quarantine; adkim=r; aspf=r
```
- `p=quarantine` — send suspicious mail to spam (upgrade to `p=reject` after 2 weeks)
- `rua` — daily aggregate reports to your inbox (use a free DMARC analyzer like dmarcian.com)
- `ruf` — forensic failure reports
- `pct=100` — apply to 100% of mail

### 3. DKIM (If using Mailgun/Google)
Your email provider gives you a DKIM key to add as a TXT record. Check their setup guide.

## Testing
```bash
dig thesynlab.com TXT +short
dig _dmarc.thesynlab.com TXT +short
```
Or use: https://www.dmarcanalyzer.com/dmarc-check/
