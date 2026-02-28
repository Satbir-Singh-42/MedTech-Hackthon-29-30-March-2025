/// <reference types="vite/client" />

// Ambient declarations for packages whose .d.ts files are missing from the
// npm install (commonly happens on Windows due to EBUSY locks during extraction).
// Vite will still bundle them correctly at runtime.

declare module "lucide-react";
declare module "date-fns";
declare module "recharts";
