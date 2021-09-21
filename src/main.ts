import SmashWrapper, { SmashTournament } from './smash_api/SmashWrapper'
require('dotenv').config()

async function main() {
    const result: SmashTournament = await SmashWrapper.instance.get_tournament("tournament/pyrateers-anti-meta-tournament");
    console.log(result);
    const creation: Date = new Date(result.createdAt * 1000);
    console.log(creation.toUTCString());
}

main();