import { NextResponse } from "next/server";
const FIKA_API_BASE_URL = process.env.NEXT_PUBLIC_FIKA_API_BASE_URL;

export async function GET() {
	const res = await fetch(FIKA_API_BASE_URL + "/fika/presence/get", {
		headers: { responsecompressed: "0" },
	});
	const players = await res.json();
	return NextResponse.json(players);
}
