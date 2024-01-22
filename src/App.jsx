import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Die from './Die'
import Stopwatch from './Stopwatch'
import { useHotkeys } from 'react-hotkeys-hook'

function App() {
  
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(localStorage.getItem('bestTime') || Infinity)
  const [timeCompare, setTimeCompare] = useState(-1)  // -1 = worse than best time, 0 = same as best time, 1 = better than best time
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') || Infinity)
  const [scoreCompare, setScoreCompare] = useState(-1) // -1 = worse than best score, 0 = same as best score, 1 = better than best score

  const diceElements = dice.map( (die) => <Die 
                                                key={die.id}
                                                id={die.id}
                                                value={die.value}
                                                isHeld={die.isHeld}
                                                hold={hold}/>)

  function hold(id) {
    if (tenzies) return;
    setIsActive(true)
    setDice(prevDice => prevDice.map( (die) => ({
                  ...die,
                  isHeld: id === die.id ? !die.isHeld : die.isHeld
    })))
  }
 
  function allNewDice () {
    const diceArray = []
    for (let i = 0; i < 10; i++) {
        diceArray.push( { id: nanoid(), value: Math.floor(Math.random() * 6)+1, isHeld: false })
    }
    return diceArray
  }

  function rollDice () {
      const audio = new Audio('roll.mp3')
      audio.volume = 0.5
      audio.play()

      setRollCount(prevCount => prevCount + 1)
      const newDice = allNewDice()
      if (!tenzies) { 
        for (let i = 0; i < 10; i++) {
          if (dice[i].isHeld)
            newDice[i] = dice[i]
        }
      } else {
        setRollCount(0)
        setTime(0)
        setScoreCompare(-1)
        setTimeCompare(-1)
      }
      setTenzies(false)
      setDice(newDice)
  }

  useEffect( () => {
    const tenzieNumber = dice[0].value
    let winner = true
    for (let i = 0; i < 10; i++){
      if (dice[i].value != tenzieNumber || !dice[i].isHeld) {
        winner = false
        break
      }
    }
     if (winner) {
        setTenzies(true)
        setIsActive(false)
        if (bestScore > rollCount) {
          setScoreCompare(1)
          setBestScore(rollCount)
        } else if (bestScore === rollCount) {
          setScoreCompare(0)
        }
        if (bestTime > time) {
          setTimeCompare(1)
          setBestTime(time)
        } else if (bestTime === time) {
          setTimeCompare(0)
        }
        const audio = new Audio('tada.mp3')
        audio.volume = 0.3 
        audio.play()
     } 
  }, [dice])

  useEffect(() => {
    localStorage.setItem('bestTime', bestTime);
  }, [bestTime]);

  useEffect(() => {
    localStorage.setItem('bestScore', bestScore);
  }, [bestScore]);

  useHotkeys('r', rollDice)

  return (
       <main className='gameBoard'>         
          <div className='innerBoard'>
          { tenzies && <Confetti /> } 
            <h1 className="title">Tenzies!</h1>
            <div className='information'>
              { !tenzies && <p className='instructions'>Roll until all dice are the same. Click a die to freeze it.</p> }
              { tenzies && <p className='youWin'>You Win!</p>}
              { tenzies && scoreCompare === 1 && <p className="bestscore">New best score of {rollCount} rolls!</p>}
              { tenzies && scoreCompare === 0 && <p className="bestscore">Best score of {rollCount} rolls!</p>}
              { tenzies && timeCompare === 1 && <p className="bestscore">New best time of {time / 100} seconds!</p>}
              { tenzies && timeCompare === 0 && <p className="bestscore">Best time of {time / 100} seconds!</p>}
            </div>
            <div className='diceContainer'>
              {diceElements}
            </div>
            <div className='stats'>
              <p>Rolls: {rollCount}</p>
              <Stopwatch isActive={isActive} time={time} setTime={setTime}/>
            </div>
            <button className='rollDice' onClick={() => rollDice()}>{tenzies ? "New Game" : "Roll"}</button>
            <div className='secondary-instructions'>Use the 'R' key for super-quick rolls!</div>
          </div>
       </main> 
  )
}

export default App
