interface StoreFooterProps {
  storeName: string;
  licenseNumber?: string | null;
}

export function StoreFooter({ storeName, licenseNumber }: StoreFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-semibold text-black">{storeName}</p>
        {licenseNumber && (
          <p className="mt-1 text-sm text-gray-600">
            🪪 Ministry of Tourism License: {licenseNumber}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">Powered by Bucket List</p>
        <p className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Bucket List. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
