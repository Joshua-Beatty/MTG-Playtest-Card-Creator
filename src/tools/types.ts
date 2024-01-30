import { Card } from "scryfall-api";

type Deck = { card: Card, count: number, uuid: string, faces?: "front" | "back" }[]

export { type Deck }