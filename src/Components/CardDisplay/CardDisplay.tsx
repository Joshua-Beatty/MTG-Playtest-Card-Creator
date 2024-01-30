import { useState } from 'react'
import { Button, IconButton, Image, Input, Textarea, ButtonGroup } from '@chakra-ui/react'
import { Card, Cards } from 'scryfall-api';
import "./cardDisplay.css"
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
function CardDisplay(props: { cards: { card: Card, count: number }[], updateCardsCallBack: (newCards: { card: Card, count: number }[]) => void }) {
  return (
    <div className="mainCardContainer">
      {props.cards.map((x, i) =>
        <div className="mainCardChild" key={x.card.id + i}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 style={{ marginRight: "auto" }}> Quantity: {x.count} </h3>
            <ButtonGroup padding="5px">
              <IconButton aria-label='Search database' icon={<FaPlus />} fontSize='20px' onClick={() => {
                props.cards[i].count++;
                props.updateCardsCallBack(props.cards);
              }} />
              <IconButton aria-label='Search database' icon={<FaMinus />} fontSize='20px' onClick={() => {
                props.cards[i].count--;
                if (props.cards[i].count == 0) { props.cards[i].count = 1; return; }
                props.updateCardsCallBack(props.cards);
              }} />
              <IconButton aria-label='Search database' icon={<FaRegTrashCan />} fontSize='20px' onClick={() => {
                props.cards.splice(i, 1)
                props.updateCardsCallBack(props.cards);
              }} />
            </ButtonGroup>
          </div>
          <Image src={x.card?.image_uris?.large || x.card?.card_faces?.[0]?.image_uris?.large}></Image>

        </div>
      )
      }
    </div>
  )
}

export default CardDisplay
