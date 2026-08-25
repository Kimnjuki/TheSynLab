# TheSynLab — Route & Sitemap Drift Detector
# Checks that every page registered in App.tsx is either:
#   1. present in the generated sitemap (indexable), OR
#   2. listed in the NOINDEX / canonical-alias disallows (intentionally hidden)
# Run: powershell -File scripts/check-routes.ps1   (after npm run build)
$ErrorActionPreference = "Stop"
$base = "C:\Users\Administrator\Downloads\TheSynLab-main"

# 1) Collect route paths registered in App.tsx
$app = Get-Content (Join-Path $base "src\App.tsx") -Raw
$routes = @()
foreach ($m in [regex]::Matches($app, '<Route\s+path="([^"]+)"')) {
    $routes += $m.Groups[1].Value
}

# 2) Collect sitemap URLs (from built dist/sitemap.xml) + noindex disallows (robots.txt)
$sitemap = Join-Path $base "dist\sitemap.xml"
if (-not (Test-Path $sitemap)) { Write-Error "dist/sitemap.xml not found. Run 'npm run build' first." }
$locSet = @{}
foreach ($m in [regex]::Matches((Get-Content $sitemap -Raw), '<loc>https://thesynlab\.com([^<]+)</loc>')) {
    $p = $m.Groups[1].Value
    $locSet[$p] = $true
}
$noindex = @()
foreach ($m in [regex]::Matches((Get-Content (Join-Path $base "public\robots.txt") -Raw), 'Disallow:\s*([/][^\s\r\n]*[^\s*/])')) {
    $noindex += $m.Groups[1].Value
}

# Convert a static pattern like /products/:slug to a regex we can ignore (dynamic)
$dynamicPattern = '[:*]'
$report = @()
foreach ($r in ($routes | Sort-Object -Unique)) {
    if ($r -eq "*") { continue }
    if ($r -match $dynamicPattern) { continue }           # dynamic => checked by prerender data
    if ($locSet[$r]) { continue }                          # indexed
    $matchedDisallow = $noindex | Where-Object { $r -eq $_ -or $r.StartsWith($_ + "/") }
    if ($matchedDisallow) { continue }                     # intentionally hidden
    $report += $r
}

Write-Output "Routes registered in App.tsx: $($routes.Count)"
Write-Output "Orphan / unclassified static routes (not in sitemap, not in robots disallow):"
$report | ForEach-Object { Write-Output "  $_" }
if ($report.Count -eq 0) {
    Write-Output "  NONE ✓ — every static route is either indexed or intentionally noindexed."
}