import React, { useEffect } from 'react'

function Stopwatch({ isActive, time, setTime }) {

  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 10);
    } else if (!isActive && time !== 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, time])

  const formatTime = () => {
    const hundredths = (`0${time % 100}`).slice(-2);
    const seconds = (`${Math.floor(time / 100)}`)
    return {seconds, hundredths};
  }; 

  const {seconds, hundredths} = formatTime()
  
  return (
    <div className='stopwatch'>
      <span className="time-segment-seconds">{seconds}</span>.
      <span className="time-segment">{hundredths}</span>
      <span className='stopwatch--text'>s elapsed</span> 
    </div>
  )
}

export default Stopwatch
