import PlayerList from "@/components/PlayerList";
import LogList from "@/components/LogList";

export default function Home() {
  return (
    <main className="p-6">
      <PlayerList />
      <LogList />
    </main>
  );
}
