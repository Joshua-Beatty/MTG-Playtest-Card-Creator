import { useState } from 'react'
import './App.css'
import { Button, Input, Textarea } from '@chakra-ui/react'
import debounce from "lodash/debounce"
import CardSearchDisplay from './Components/CardSearch/CardSearchDisplay';
import CardSearch from './Components/CardSearch/CardSearch';
import { Card } from 'scryfall-api';
import CardDisplay from './Components/CardDisplay/CardDisplay';
const placeholder = `4 Apex Altisaur
3 Bala Ged Recovery // Bala Ged Sanctuary
3 Beast Within
23 Forest
1 Branchloft Pathway // Boulderloft Pathway
1 Bronzebeak Foragers
4 Brushland
1 Griselbrand
4 Cavern of Souls
4 Chromatic Lantern
`

function App() {
  const [text, setText] = useState("");
  const [deck, setDeck] = useState([] as {card: Card, count: number}[]);
  function addCardCallback(card: Card){
    setDeck([{card: card, count: 1}, ...deck])
  }

  return (
    <div className="mainContainer">
      <div className="content">
      <h1>MTG Playtest Card Creator</h1>
      <Textarea width="100%" minH="25ch" placeholder={placeholder} onChange={(x)=>setText(x.target.value)} />
      <div className="addHolder">
        <Button width="20%" minW="15ch">Add Cards</Button> or <CardSearch addCardCallback={addCardCallback}/>
      </div>
      <CardDisplay cards={deck} updateCardsCallBack={(x)=>{setDeck([...x])}}/>
      
      </div>
      <footer>
        <p>
            Portions of MTG Playtest Card Creator are unofficial Fan Content permitted
            under the Wizards of the Coast Fan Content Policy. The literal and
            graphical information presented on this site about Magic: The Gathering,
            including card images and mana symbols, is copyright Wizards of the
            Coast, LLC. MTG Playtest Card Creator is not produced by or endorsed by
            Wizards of the Coast.
        </p>
    </footer>
    </div>
  )
}

export default App
