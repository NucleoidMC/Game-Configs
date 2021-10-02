import { walkSync } from 'https://deno.land/std@0.109.0/fs/mod.ts';

for (const entry of walkSync('./data')) {
	console.log(entry.path);

	if (entry.isFile && (entry.path.includes("games") || entry.path.includes("game_portals") && entry.name.includes(".json")) ) {
		const obj = JSON.parse(Deno.readTextFileSync(entry.path));

		if ("translation" in obj) {
			obj["name"] = {translate: obj["translation"]}
			delete obj["translation"]
		}

		if ("games" in obj && entry.path.includes("game_portals")) {
			const newGames = [];

			console.log(obj["games"])

			for (const game of obj["games"]) {
				if (game == null) {
					continue;
				}

				newGames.push(game["game"] || game)
			}

			obj["games"] = newGames
		}
		Deno.writeTextFileSync(entry.path, JSON.stringify(obj, null, 2))
	}
}
