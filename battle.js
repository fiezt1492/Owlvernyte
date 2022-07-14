
class Game {
  p1;
  p2;
  turn; 
  round;
  constructor () {

  }
  
  getResult () {}

}

const p1 = {
  id,
  atk1,
  def1,
  spd1,
  skills1
}

const p2 = {
  id, 
  atk2,
  def2,
  spd2,
  skills2
}

const game = {
  turn = 1,
  round = 1
}

const standbyPhase = (fP, sP) => {

}

const combatPhase = (fP, sP) => {
  // Dodge / Block
  // Critical
  // Attack
  // Counter

}

const endingPhase = (fP, sP) => {

}

while (!wasEnded(p1, p2)) {

  
	const [fP, sP] = setOrder(p1, p2)

	standbyPhase(fP, sP)

	combatPhase(fP, sP)
		
	endingPhase(fP, sP)

}