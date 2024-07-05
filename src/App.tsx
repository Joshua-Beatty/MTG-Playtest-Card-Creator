import { useEffect, useState } from 'react'
import './App.css'
import { Button, Checkbox, Progress, Spinner, Textarea, useToast } from '@chakra-ui/react'
import CardSearch from './Components/CardSearch/CardSearch';
import { Card } from 'scryfall-api';
import CardDisplay from './Components/CardDisplay/CardDisplay';
import { Deck } from './tools/types';
import { v4 as uuidv4 } from "uuid"
import processDeckList from './tools/processDeckList';
import downloadDeck from './tools/downloadDeck';
import exampleDecklist from './tools/exampleDecklist';
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
  const [deckList, setdeckList] = useState("");
  const [deck, setDeck] = useState([] as Deck);
  const [loading, setLoading] = useState<boolean>(false);
  const [printing, setPrinting] = useState<boolean>(false);
  const [progress, setProgress] = useState({ p: 0, t: 1 });
  const [useMask, setUseMask] = useState<boolean>(true);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 500px)").matches
  )

  function addCardCallback(card: Card) {
    setDeck([{ card: card, count: 1, uuid: uuidv4() }, ...deck])
  }

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener('change', e => setMatches(e.matches));
  }, []);

  const toast = useToast()
  function addDecklist() {
    processDeckList(deckList, (errors: string[]) => {
      if (errors.length > 0)
        toast({
          title: 'Error',
          description: errors.map((attribute, index) => {
            const isLast = errors.length === (index + 1);
            return !isLast ? <>{attribute}<br /></> : attribute;
          }),
          status: 'error',
          duration: null,
          isClosable: true,
        })
    }, setLoading, (newCards: Deck) => {
      setDeck([...newCards, ...deck])
    })
  }

  return (
    <div className="mainContainer">
      <div className="content">

        <div style={{ display: !matches ? "block" : "flex", margin: "5px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ display: "inline" }}>MTG Video Images Generator</h1>  <br /><Button width="20%" minW="17ch" isDisabled={loading} onClick={() => {
            setdeckList(exampleDecklist)
            toast({
              title: 'Click Add Cards!',
              description: "",
              status: "info",
              duration: 1000,
              isClosable: true,
            })
          }}>Load Example Deck</Button>
        </div>

        <Textarea width="100%" minH="25ch" value={deckList} placeholder={placeholder} isDisabled={loading} onChange={(x) => setdeckList(x.target.value)} />
        <div className="addHolder">
          <Button colorScheme='yellow' isDisabled={loading} width="15%" minW="15ch" onClick={addDecklist}>Add Cards</Button> or <CardSearch isDisabled={loading} addCardCallback={addCardCallback} />
          {loading ? <Spinner /> : null}
        </div>
        <Button width="20%" minW="15ch" isDisabled={loading} onClick={() => { setDeck([]) }}>Remove All Cards</Button>

        <Button marginLeft={"20px"} isDisabled={loading} width="15%" minW="15ch" onClick={() => downloadDeck((x) => { setLoading(x); setPrinting(x) }, deck, (p, t) => { setProgress({ p, t }); }, useMask)}>Download Images</Button>
        <span style={{marginLeft: "20px"}}>Use Mask:
        <Checkbox  marginLeft={"5px"} paddingTop={"10px"} isChecked={useMask} onChange={(e) => { setUseMask(e.target.checked) }} /></span>

        {
          printing && progress.t ? <Progress marginTop="10px" value={progress.p / progress.t * 100} /> : null
        }

        <CardDisplay isDisabled={loading} cards={deck} updateCardsCallBack={(x) => { setDeck([...x]) }} />
      </div>
      <footer>
        <p>
          Portions of MTG Video Images Generator are unofficial Fan Content permitted
          under the Wizards of the Coast Fan Content Policy. The literal and
          graphical information presented on this site about Magic: The Gathering,
          including card images and mana symbols, is copyright Wizards of the
          Coast, LLC. MTG Video Images Generator is not produced by or endorsed by
          Wizards of the Coast.
        </p>
      </footer>
    </div>
  )
}

export default App

