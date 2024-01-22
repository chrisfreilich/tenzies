import { useState } from 'react'

function Die(props) {

  return (
       <div className={props.isHeld ? 'die held'  : 'die'}
            onClick={() =>props.hold(props.id)}
            >
          <img src={`${props.value}.svg`} />
       </div>
  )
}

export default Die
