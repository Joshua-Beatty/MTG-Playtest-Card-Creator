import { Card } from "scryfall-api";
import client from "./client";
import { Deck } from "./types";
import chunk from "lodash/chunk";
import { v4 } from "uuid";

const format = /\d+ .+/
async function processDeckList(deckList: string, setErrors: (erros: string[]) => unknown, setLoading: (state: boolean) => unknown, newDataCallBack: (deck: Deck) => unknown) {
    setLoading(true);
    const errors: string[] = [];
    const Deck: Deck = [];
    
    const parsedList: { count: number, name: string }[] = deckList.split("\n").filter(x => {
        if (["Mainboard", "Sideboard"].includes(x))
            return false;
        if (!x.trim())
            return false;
        if (!format.test(x.trim())) {
            errors.push(`${x} is not in the format "1 CardName"`)
            return false;
        }
        return true;
    }).map(x => {
        return {
            count: Number(x.substring(0, x.indexOf(' '))),
            name: x.substring(x.indexOf(' ') + 1).trim()
        }
    })

    const chunkedList = chunk(parsedList, 75);
    for (const chunk of chunkedList) {
        const identifiers = []
        for (const card of chunk) {
            identifiers.push({ "name": card.name.split("//")[0].trim() })
        }

        const { data } = await client.post(`/cards/collection`, { identifiers })

        for (const error of data.not_found) {
            errors.push(`Could not find ${error.name}`)
        }

        for (const card of data.data as Card[]) {
            const count = chunk.find((x) => card.name.includes(x.name))?.count || 1;
            Deck.push({
                card,
                count,
                uuid: v4()
            })
        }
    }
    
    setErrors(errors);
    newDataCallBack(Deck);
    setLoading(false);
}

export default processDeckList