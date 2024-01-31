import { Card } from "scryfall-api";
import useSWR from "swr";
import client from "../../tools/client";
import { Spinner, Image } from "@chakra-ui/react";
import "./ArtPicker.css"


function ArtPicker(props: { cardName: string, card: Card, setNewArt: (newCard: Card) => unknown, setCode: string }) {

    const { data, error, isLoading } = useSWR(`/cards/search?include_extras=true&unique=prints&order=released&is=highres&q=${encodeURIComponent(`-layout:art-series ${props.setCode ? `set:${props.setCode}` : ""} !"${props.cardName}"`)}`, async (url) => {
        if (!props.cardName)
            return null;
        const { data } = await client.get(url);
        return data
    })




    if (isLoading) {
        return (<Spinner />)
    }
    if (error) {
        return (<div style={{marginTop: "10px"}}> No prints found</div>)
    }

    return (
        <div>
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1%" }}>
                <div style={{ margin: "5px" }} className="cardHolder">
                    <div style={{ height: "2lh", display: "flex", alignItems: "flex-end" }}>{props.card.set_name} {`(${props.card.set.toLocaleUpperCase()})`}</div>
                    <Image style={{ border: "solid lime 1px" }} src={props.card?.image_uris?.large || props.card?.card_faces?.[0]?.image_uris?.large} />
                    {props.card?.card_faces?.[0]?.image_uris ?
                        <div style={{ height: 0 }}><Image style={{
                            position: "relative",
                            width: "50%",
                            top: 0,
                            left: 0,
                            transform: "translate(100%,-100%)"
                        }} src={props.card?.card_faces?.[1]?.image_uris?.large}></Image></div>
                        : null}
                </div>
                {data?.data?.map((x: Card) => {
                    return (
                        <div style={{ margin: "5px" }}  className="cardHolder">
                            <div style={{ height: "2lh", display: "flex", alignItems: "flex-end" }}>{x.set_name} {`(${x.set.toLocaleUpperCase()})`}</div>
                            <Image style={{ cursor: "pointer" }} src={x?.image_uris?.large || x?.card_faces?.[0]?.image_uris?.large} onClick={() => {
                                props.setNewArt(x);
                            }} />
                            {x?.card_faces?.[0]?.image_uris ?
                                <div style={{ height: 0 }}><Image style={{
                                    position: "relative",
                                    width: "50%",
                                    top: 0,
                                    left: 0,
                                    transform: "translate(100%,-100%)",
                                    pointerEvents: "none"
                                }} src={x?.card_faces?.[1]?.image_uris?.large}></Image></div>
                                : null}
                        </div>

                    )
                })}
            </div>
        </div>
    )
}

export default ArtPicker