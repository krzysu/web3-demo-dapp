"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export function ConnectWallet() {
  const { address, isConnecting } = useAccount();

  return (
    <div className="flex items-center gap-4">
      <ConnectKitButton />
      {address && (
        <p className="font-mono text-sm">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
      {isConnecting && <p className="text-sm">Connecting...</p>}
    </div>
  );
}
