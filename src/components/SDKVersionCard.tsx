// src/components/SDKVersionCard.tsx

export function SDKVersionCard({ sdk }: { sdk: any }) {
  const isOutdated = sdk.currentUsed && sdk.currentUsed !== sdk.latest;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold text-sm text-gray-600">{sdk.sdkLanguage}</h3>
      <p className="text-sm text-gray-700">
        Using: {sdk.currentUsed || "Not specified"}
      </p>
      <p className="text-sm text-gray-700">Latest: {sdk.latest}</p>
      {isOutdated && (
        <p className="text-sm text-red-500 font-semibold mt-1">
          ⚠️ Outdated SDK version!
        </p>
      )}
      {sdk.releaseNotes && (
        <details className="mt-2 text-sm text-gray-600">
          <summary className="cursor-pointer">Release Notes</summary>
          <pre className="whitespace-pre-wrap mt-1">{sdk.releaseNotes}</pre>
        </details>
      )}
    </div>
  );
}
