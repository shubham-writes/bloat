// Placeholder results page — full implementation on Day 2
export default function ResultsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Audit #{params.id}</h1>
        <p className="text-gray-400">Full results page coming soon (Day 2).</p>
      </div>
    </main>
  );
}
