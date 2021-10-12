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

			for (const game of obj["games"]) {
				if (game == null) {
					continue;
				}

				newGames.push(game["game"] || game)
			}

			obj["games"] = newGames
		}

		if ("custom" in obj) {
			const custom = obj["custom"];
			if ("gamegui:icon" in custom) {
				obj["icon"] = custom["gamegui:icon"];
				delete custom["gamegui:icon"];
			}

			if (Object.values(custom).length == 0) {
				delete obj["custom"];
			} 
		}

		Deno.writeTextFileSync(entry.path, JSON.stringify(obj, null, 2))
	}
}
