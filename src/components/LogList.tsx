"use client";
import { useEffect, useState } from "react";

interface Log {
	id: number;
	player: string;
	activity: string;
	timestamp: number;
}

export default function LogList() {
	const LOG_UPDATE_INTERVAL = Number(process.env.LOG_UPDATE_INTERVAL) || 30000;
	const LOGS_PER_PAGE = Number(process.env.LOGS_PER_PAGE) || 10;

	const [logs, setLogs] = useState<Log[]>([]);

	useEffect(() => {
		const fetchLogs = () => {
			fetch("/api/log")
				.then((res) => res.json())
				.then((data) => {
					setLogs(data.slice(0, LOGS_PER_PAGE));
				});
		};
		fetchLogs();
		const interval = setInterval(fetchLogs, LOG_UPDATE_INTERVAL);
		return () => clearInterval(interval);
	}, []);

	const readableTime = (timestamp: number) => {
		return new Date(timestamp).toLocaleTimeString();
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Event Log</h1>
			<table className="table-auto w-full border-collapse border border-gray-700 mt-4">
				<thead>
					<tr>
						<th className="border border-gray-700 px-4 py-2">Time</th>
						<th className="border border-gray-700 px-4 py-2">Player</th>
						<th className="border border-gray-700 px-4 py-2">Activity</th>
					</tr>
				</thead>
				<tbody>
					{logs.map((log) => (
						<tr key={log.id}>
							<td className="border border-gray-700 px-4 py-2">{readableTime(log.timestamp)}</td>
							<td className="border border-gray-700 px-4 py-2">{log.player}</td>
							<td className="border border-gray-700 px-4 py-2">{log.activity}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
