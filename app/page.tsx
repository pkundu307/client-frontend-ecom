// app/page.tsx
export const runtime = "edge";

// ✅ No "use client" here — edge runtime pages must NOT be client components
// ✅ No next/dynamic with ssr:false — incompatible with edge runtime on Cloudflare
import HomeClient from "./page/HomeClient";

export default function Page() {
  return (
    <main className="no-scrollbar">
      <HomeClient />
    </main>
  );
}
