import { useEffect, useState } from 'react'
//import './App.css'
import { Box, Button, ButtonGroup, Image, Textarea } from '@chakra-ui/react'
import client from './client';
import useSWR from 'swr'
import { Card } from 'scryfall-api';
import { distance } from "fastest-levenshtein"
interface CardSearchDisplayProps {
  searchText: string,
  addCardCallback: (card: Card) => void
}


function CardSearchDisplay(props: CardSearchDisplayProps) {

  const [hoverLink, setHoverLink] = useState("");

  const { data, error, isLoading } = useSWR(`/cards/search?q=${encodeURIComponent(props.searchText)}`, async (url) => {
    if (!props.searchText)
      return null;
    const { data } = await client.get(url);
    return data
  })
  const cardData = data?.data as Card[];

  if (!props.searchText)
    return null;

  if (error) return <div>No Results</div>
  if (isLoading) return <div>loading...</div>

  const cardList = cardData.sort((a, b) => distance(a.name, props.searchText) - distance(b.name, props.searchText)).slice(0, 15)



  return (
    <div style={{ position: "absolute", display: 'flex' }}>
      <Box borderRadius="5px" maxH="300px" overflow="scroll" overflowX="clip" background="#0003">

        <ButtonGroup mx="auto" width="100%" variant='outline' spacing='6' isAttached flexDir={'column'} orientation="vertical">
          {
            cardList.map(x => <Button
              key={x.id}
              onMouseOut={() => { setHoverLink("") }}
              onMouseOver={() => { setHoverLink(x?.image_uris?.large || "") }}
              onClick={() => { console.log("hi"); props.addCardCallback(x) }}
              width="100%">{x.name}</Button>)
          }
        </ButtonGroup>
      </Box>
      <Image maxW="20%" src={hoverLink} objectFit="scale-down"></Image>
    </div>
  )
}

export default CardSearchDisplay
