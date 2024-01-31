import { useState } from 'react'
import { IconButton, Image, Input, ButtonGroup, Select, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { Card } from 'scryfall-api';
import "./cardDisplay.css"
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Deck } from '../../tools/types';
import ArtPicker from './ArtPicker';
import debounce from 'lodash/debounce';
function CardDisplay(props: { cards: Deck, updateCardsCallBack: (newCards: Deck) => void, isDisabled: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cardInfo, setCardInfo] = useState({ index: -1, name: "" })
  const [setCode, setSetCode] = useState("")
  
  const [cardSearchChanged] = useState(() => {
    return debounce((setCode: string) => {
      setSetCode(setCode)
    }, 250)
  });



  return (
    <div className="mainCardContainer">
      {props.cards.map((x, i) =>
        <div className="mainCardChild" key={x.uuid}>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "auto" }}>
              <p> Quantity: {x.count} </p>

              {
                x.card?.card_faces?.[0]?.image_uris ?
                  <Select  isDisabled={props.isDisabled}  size='xs' width="fit-content" value={x.faces || ""} onChange={(x) => {
                    props.cards[i].faces = x.target.value as "front" | "back"
                    if (!x.target.value)
                      delete props.cards[i].faces
                    props.updateCardsCallBack(props.cards);
                  }}>
                    <option value=''>Both Faces</option>
                    <option value='front'>Front Only</option>
                    <option value='back'>Back Only</option>
                  </Select>
                  : null
              }
            </div>


            <ButtonGroup  isDisabled={props.isDisabled}  padding="7px" >
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
          <Image  style={{cursor: props.isDisabled ? "" : "pointer"}} src={x.card?.image_uris?.large || x.card?.card_faces?.[0]?.image_uris?.large} onClick={() => {
            if(props.isDisabled)
              return;
            setCardInfo({ name: x.card.name, index: i })
            setSetCode("")
            onOpen();
          }}></Image>
          {
            x.card?.card_faces?.[0]?.image_uris ?

              <div style={{ height: 0 }}><Image style={{
                position: "relative",
                width: "50%",
                top: 0,
                left: 0,
                transform: "translate(100%,-100%)",
                pointerEvents: "none"
              }} src={x.card?.card_faces?.[1]?.image_uris?.large}></Image></div>

              : null
          }

        </div>
      )
      }
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Art Picker</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isOpen ?
              <div>
                <div>
                <span style={{marginRight: "10px"}}>Setcode Search: </span><Input style={{width: "20%"}} onChange={(x)=>cardSearchChanged(x.target.value)}/></div>
                <ArtPicker cardName={cardInfo.name} card={props.cards[cardInfo.index].card} setNewArt={(x: Card) => {
                props.cards[cardInfo.index].card = x;
                props.updateCardsCallBack(props.cards);
                onClose();
              }} setCode={setCode}/>
              </div>
              : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>



  )
}

export default CardDisplay
