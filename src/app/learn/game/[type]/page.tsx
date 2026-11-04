import { notFound } from "next/navigation";
import { GameScreen } from "@/components/learn/game/GameScreen";
import { GAME_TYPES, isGameType } from "@/lib/curriculum/games";

export function generateStaticParams() {
  return GAME_TYPES.map((type) => ({ type }));
}

export default async function GamePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isGameType(type)) notFound();

  return <GameScreen key={type} type={type} />;
}
