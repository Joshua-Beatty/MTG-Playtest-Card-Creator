import { useState } from 'react'
import './App.css'
import { Textarea } from '@chakra-ui/react'

function App() {
  const [text, setText] = useState("");

  return (
    <div className="mainContainer">
      <h1>MTG Playtest Card Creator</h1>
      <Textarea placeholder='Here is a sample placeholder' onChange={(x)=>setText(x.target.value)} />
      <div>Hello{!!text  ? ` ${text}` : "" }!</div>
    </div>
  )
}

export default App
