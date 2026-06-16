export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-3">Thank you!</h1>
      <p className="text-stone-500 text-lg max-w-md">
        Your order is being processed. We&apos;ll send you a confirmation email once your poster is on its way.
      </p>
      <a
        href="/"
        className="mt-8 px-6 py-3 rounded-full bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
      >
        Make another
      </a>
    </main>
  );
}
