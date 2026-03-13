# Create repo on GitHub (Kimnjuki)

1. **Sign in to GitHub** (if not already): https://github.com/login  
2. **Create new repository**: https://github.com/new  
   - **Repository name:** `TheSynLab`  
   - **Description (optional):** Vite + React + TypeScript + shadcn + Convex  
   - Choose **Public**, leave "Add a README" **unchecked** (you already have code).  
   - Click **Create repository**.

3. **Push this project** (run in PowerShell from this folder):

```powershell
cd "c:\Users\Administrator\Downloads\TheSynLab"
git init
git add .
git commit -m "Initial commit: TheSynLab"
git branch -M main
git remote add origin https://github.com/Kimnjuki/TheSynLab.git
git push -u origin main
```

If the repo already exists at https://github.com/Kimnjuki/TheSynLab, skip step 2 and run only the git commands in step 3.
