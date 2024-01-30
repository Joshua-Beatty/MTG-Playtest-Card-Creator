import { useState } from 'react'
import classes from './App.module.css'
import { Button, Input, Textarea } from '@chakra-ui/react'

function App() {
  const [text, setText] = useState("");

  return (
    <div className={classes.mainContainer}>
      <h1>MTG Playtest Card Creator</h1>
      <Textarea  maxW="90%" width="60ch" placeholder='Here is a sample placeholder' onChange={(x)=>setText(x.target.value)} />
      <div>
        <Button>Add Cards</Button> or <Input placeholder="Shivan Dragon"></Input>
      </div>
      <div>Hello{!!text  ? ` ${text}` : "" }!</div>
    </div>
  )
}

export default App
