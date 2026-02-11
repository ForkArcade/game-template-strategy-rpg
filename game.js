const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

// Game state
let score = 0

// Initialize when SDK connects to platform
ForkArcade.onReady(function(context) {
  console.log('Strategy RPG ready:', context.slug)
  start()
})

function start() {
  // TODO: implement your strategy RPG here
  render()
}

function render() {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#fff'
  ctx.font = '24px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('Strategy RPG — implement game.js', canvas.width / 2, canvas.height / 2)
}

function gameOver() {
  ForkArcade.submitScore(score)
}
