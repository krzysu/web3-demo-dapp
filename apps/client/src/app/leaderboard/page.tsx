import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { AddToLeaderboard } from "@/components/leaderboard/AddToLeaderboard";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Leaderboard</h1>
      <AddToLeaderboard />
      <Leaderboard />
    </div>
  );
}
