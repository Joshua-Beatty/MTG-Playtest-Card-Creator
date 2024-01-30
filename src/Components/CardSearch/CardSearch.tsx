import { useEffect, useRef, useState } from 'react'
//import './App.css'
import { Box, Button, ButtonGroup, Input, Textarea } from '@chakra-ui/react'
import client from '../../tools/client';
import useSWR from 'swr'
import { Card } from 'scryfall-api';
import { distance } from "fastest-levenshtein"
import debounce from 'lodash/debounce';
import CardSearchDisplay from './CardSearchDisplay';

function CardSearch(props: {
    addCardCallback: (card: Card) => void,
    isDisabled: boolean
}) {
    const [cardSearch, setcardSearch] = useState("");
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const ref = useRef<any>(null);

    const [cardSearchChanged] = useState(() => {
        return debounce((cardName: string) => {
            setcardSearch(cardName)
        }, 250)
      });


    
  function addCardCallback(card: Card){
    console.log(card)
    props.addCardCallback(card)
    setcardSearch("")
    setValue("")
    ref?.current?.focus();
  }

    return (
        <div>
        <Input isDisabled={props.isDisabled} width="40vw" maxW="300px" ref={ref} value={value} onFocus={()=>{setFocused(true)}} onBlur={(e)=>{if(e.relatedTarget){} else setFocused(false) }} onChange={(x) => {setValue(x.target.value); cardSearchChanged(x.target.value)}} placeholder="Search a card by name"></Input>
        { focused ? <CardSearchDisplay searchText={cardSearch} addCardCallback={addCardCallback}/> : null}
        </div>
    )
}

export default CardSearch

