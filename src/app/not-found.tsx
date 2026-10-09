import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-glow flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
        This page <span className="text-peach">burned out.</span>
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-body">
        The page you&apos;re looking for doesn&apos;t exist — but there&apos;s
        plenty of warm light this way instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-sage px-7 py-3.5 text-[15px] font-semibold text-softwhite transition-colors hover:bg-sage-deep"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-softwhite px-7 py-3.5 text-[15px] font-semibold text-ink soft-shadow transition-colors hover:bg-sage-soft"
        >
          Browse Candles
        </Link>
      </div>
    </div>
  );
}
