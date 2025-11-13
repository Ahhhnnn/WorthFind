# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorthFind is a Next.js application for calculating job value and work-life balance. It's a Chinese-language web application that helps users evaluate their job's cost-effectiveness through a multi-step calculator.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Radix UI primitives
- **Theme**: next-themes for dark/light mode
- **Animation**: Framer Motion
- **Screenshot**: html2canvas for result capture

### Project Structure

```
app/
├── layout.tsx          # Root layout with theme provider and fonts
├── page.tsx           # Home page that redirects to landing page
├── globals.css        # Global styles
├── landing/           # Landing page components
│   ├── page.tsx       # Landing page layout
│   └── components/    # Landing page sections
│       ├── Header.tsx
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── CallToAction.tsx
│       └── Footer.tsx
└── calculator/        # Calculator functionality
    └── page.tsx       # Multi-step calculator with result generation

components/
└── ui/                # Reusable UI components

lib/
└── utils.ts          # Utility functions
```

### Key Features

1. **Landing Page**: Marketing page with hero section, features, and call-to-action
2. **Multi-step Calculator**: 5-step form collecting data across dimensions:
   - Economic returns (salary, bonus, benefits)
   - Time costs (weekly hours, commute, overtime)
   - Growth value (skills, promotion, industry prospects)
   - Work experience (pressure, team atmosphere, interest)
   - Life balance (flexibility, vacation, work-life balance)

3. **Result Generation**: Calculates comprehensive score with humor labels and personalized recommendations

4. **Screenshot Feature**: Users can save their results as images using html2canvas

### Calculation Algorithm

The calculator uses a weighted scoring system:
- Economic returns: 30%
- Time costs: 25%
- Growth value: 20%
- Work experience: 15%
- Life balance: 10%

Results include humorous labels in Chinese (e.g., "人生赢家", "现代牛马", "血汗工厂") and personalized recommendations based on low-scoring dimensions.

### Important Implementation Details

- All text content is in Chinese
- Uses React 19.2.0 and Next.js 16.0.1
- Path aliases configured (`@/*` maps to root)
- TypeScript strict mode enabled
- Supports both light and dark themes
- Responsive design with Tailwind CSS