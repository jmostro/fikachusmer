"use client";
import { useEffect, useState } from "react";

interface Player {
	nickname: string;
	level: number;
	activity: number;
	activityStartedTimestamp: number;
	raidInformation: {
		location: string;
		side: string;
		time: string;
	};
}

export default function PlayerList() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [previousPlayers, setPreviousPlayers] = useState<Player[]>([]);

	useEffect(() => {
		const fetchPlayers = () => {
			fetch("/api/players")
				.then((res) => res.json())
				.then((data) => setPlayers(data));
		};

		fetchPlayers();
		const interval = setInterval(fetchPlayers, 10000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const logPlayerChanges = (currentPlayers: Player[], previousPlayers: Player[]) => {
			// Players who joined
			currentPlayers.forEach((current) => {
				if (!previousPlayers.find((previous) => previous.nickname === current.nickname)) {
					fetch("/api/log", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ activity: "player_joined", player: current.nickname }),
					});
				}
			});

			// Players who left
			previousPlayers.forEach((previous) => {
				if (!currentPlayers.find((current) => current.nickname === previous.nickname)) {
					fetch("/api/log", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ activity: "player_left", player: previous.nickname }),
					});
				}
			});
			setPreviousPlayers(currentPlayers);
		};

		logPlayerChanges(players, previousPlayers);
	}, [players]);

	const playerActivities = [
		{ id: 0, name: "IN_MENU", description: "Menu" },
		{ id: 1, name: "IN_RAID", description: "Raid" },
		{ id: 2, name: "IN_STASH", description: "Stash" },
		{ id: 3, name: "IN_HIDEOUT", description: "Hideout" },
		{ id: 4, name: "IN_FLEA", description: "Flea market" },
	];

	const timeElapsedSinceUnixTimestamp = (timestamp: number) => {
		return Math.floor((Date.now() / 1000 - timestamp) / 60);
	};

	const activityDescription = (activityId: number) => {
		return playerActivities.find((activity) => activity.id === activityId)?.description || "Unknown";
	};

	const raidDescription = (raidInformation?: { location: string; side: string; time: string }) => {
		return raidInformation ? `${raidInformation.location} - ${raidInformation.side}` : "-";
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Online Players</h1>
			<table className="table-auto w-full border-collapse border border-gray-700 mt-4">
				<thead>
					<tr>
						<th className="border border-gray-700 px-4 py-2">Nickname</th>
						<th className="border border-gray-700 px-4 py-2">Level</th>
						<th className="border border-gray-700 px-4 py-2">Activity</th>
						<th className="border border-gray-700 px-4 py-2">Time</th>
						<th className="border border-gray-700 px-4 py-2">Raid Location</th>
					</tr>
				</thead>
				<tbody>
					{players.map((player) => (
						<tr key={player.nickname}>
							<td className="border border-gray-700 px-4 py-2">{player.nickname}</td>
							<td className="border border-gray-700 px-4 py-2">{player.level}</td>
							<td className="border border-gray-700 px-4 py-2">{activityDescription(player.activity)}</td>
							<td className="border border-gray-700 px-4 py-2">{timeElapsedSinceUnixTimestamp(player.activityStartedTimestamp)} mins</td>
							<td className="border border-gray-700 px-4 py-2">{raidDescription(player.raidInformation)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
