# Coolify: Show site on thesynlab.com

If **Deployment is Finished** and the healthcheck is **healthy** but **thesynlab.com** does not load, the app is running but the domain is not attached or DNS is not pointing to the server.

## 1. Add the domain in Coolify

1. Open your **TheSynLab** application in Coolify.
2. Go to the **Domains** / **FQDN** section (sometimes under **Configuration** or **Settings**).
3. Add:
   - **thesynlab.com**
   - **www.thesynlab.com** (if you want both)
4. Save. Coolify (Traefik) will route requests for these hosts to your container and will request a Let’s Encrypt certificate for HTTPS.

## 2. Point DNS to the Coolify server

At your domain registrar (where you bought thesynlab.com):

- **A record**  
  - **Name:** `@` (or `thesynlab.com`)  
  - **Value:** Your Coolify server’s **public IP**
- **A or CNAME for www**  
  - **Name:** `www`  
  - **Value:** Same **public IP** (A) or `thesynlab.com` (CNAME)

Wait 5–60 minutes for DNS to propagate. Test with:

```bash
ping thesynlab.com
```

The IP should match your Coolify server.

## 3. Check ports and proxy

- Server firewall: allow **80** (HTTP) and **443** (HTTPS).
- In Coolify, the app should be set to use the **Coolify proxy** (default), so external 80/443 go to Traefik, which forwards to your container’s port 80.

## 4. If it still doesn’t load

- **“Connection refused” or “Cannot connect”** → DNS not pointing to the server, or firewall blocking 80/443.
- **“502 Bad Gateway”** → Proxy can’t reach the container; check container is running and healthcheck is healthy.
- **Blank page / wrong site** → Hard refresh (Ctrl+F5) or clear cache; confirm the correct FQDN is set for this app in Coolify.

After adding the FQDN and DNS, use **https://thesynlab.com** (or **https://www.thesynlab.com**). Coolify will redirect HTTP to HTTPS once the certificate is issued.
