# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Algorütm Podcast Website** - A Next.js-based website for the Algorütm tech podcast.

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Captivate.fm API (for episode data)
- Vercel (deployment)

**Current Status:** Initial development - setting up repository structure and basic features.

---

## Development Workflow

### Branch Protection

**The `main` branch is protected. ALL changes MUST go through a pull request.**

✅ **Correct Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/description
# or: git checkout -b fix/description

# 2. Make changes and commit
git add <files>
git commit -m "type: description"

# 3. Push feature branch
git push -u origin feature/description

# 4. Create pull request on GitHub
# Wait for CI checks and code review before merging
```

❌ **Never do this:**

```bash
git checkout main
git commit -m "changes"
git push origin main  # ❌ Will be rejected by branch protection
```

### Commit Message Format

Use conventional commits:

```text
feat: add episode listing page
fix: correct audio player alignment
docs: update README with setup instructions
style: format with Prettier
refactor: simplify API client
test: add tests for episode fetching
chore: update dependencies
```

---

## Code Quality Standards

### TypeScript

- All new code should use TypeScript
- Enable `strict: true` in `tsconfig.json`
- Avoid `any` types - use proper types or `unknown`

### Code Style

- Use ESLint for code quality
- Use Prettier for formatting (runs automatically)
- Follow Next.js and React best practices

### Documentation

See [.claude/shared/documentation-rules.md](.claude/shared/documentation-rules.md) for detailed guidelines.

**Quick summary:**
- Add JSDoc comments for public functions
- Document `@throws` when functions can throw errors
- Explain **why**, not what (code should be self-documenting)
- Avoid redundant comments

Example:

```typescript
/**
 * Fetches episodes from Captivate.fm API with caching
 *
 * @throws {Error} When API credentials are missing or invalid
 */
export async function getEpisodes(): Promise<Episode[]> {
  // Implementation
}
```

### Minimal Changes Principle

See [.claude/shared/common-constraints.md](.claude/shared/common-constraints.md) for full details.

**Key principle:** Make the SMALLEST change that solves the problem.

- Focus only on the issue/feature being worked on
- Don't refactor unrelated code
- Don't add features beyond requirements

---

## Project Structure

```text
algorytm-home/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Page routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── api/              # API clients (Captivate.fm)
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── public/                # Static assets
│   ├── images/
│   └── ...
├── .github/
│   └── workflows/
│       └── ci.yml         # CI checks (lint, type-check, build)
└── ...config files
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking
npm run type-check

# Format code with Prettier
npm run format
```

---

## API Integration

### Captivate.fm API

Episode data comes from Captivate.fm API. API client should:
- Cache responses to avoid rate limiting
- Handle errors gracefully
- Use TypeScript types for responses

**API Client Location:** `lib/api/captivate.ts`

Example structure:

```typescript
export interface Episode {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  audioUrl: string;
  duration: number;
  // ... other fields
}

export async function getEpisodes(): Promise<Episode[]> {
  // Fetch from Captivate.fm API
}

export async function getEpisode(id: string): Promise<Episode> {
  // Fetch single episode
}
```

---

## Contributing

This is a community-driven project. We welcome contributions!

### For Contributors

1. **Find or create an issue** for what you want to work on
2. **Fork the repository** and create a feature branch
3. **Make your changes** following the code quality standards
4. **Test locally** to ensure everything works
5. **Submit a pull request** with a clear description
6. **Wait for review** and address any feedback

### Good First Issues

Look for issues labeled `good-first-issue` for beginner-friendly tasks.

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
3. Add environment variables (if needed)
4. Deploy!

**Auto-deployment:**
- Push to `main` → Production deployment
- Open PR → Preview deployment

---

## Environment Variables

Create a `.env.local` file for local development:

```bash
# Captivate.fm API
CAPTIVATE_API_KEY=your_api_key_here
CAPTIVATE_SHOW_ID=your_show_id_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

**Never commit `.env.local` to git!** (Already in `.gitignore`)

---

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Run type checker
npm run type-check

# Check specific file
npx tsc --noEmit path/to/file.ts
```

### Linting Errors

```bash
# Fix automatically
npm run lint:fix

# Check specific file
npx eslint path/to/file.ts
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Captivate.fm API Docs](https://captivate.fm/api-documentation)
