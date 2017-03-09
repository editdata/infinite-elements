var html = require('yo-yo')

var infiniteElements = require('./index')

var i = 0
var l = 200
var rows = []

for (i; i < l; i++) {
  rows.push(createRow(i))
}

setInterval(function () {
  var i = rows.length
  rows.push(createRow(i))
  tree.render(rows)
}, 1000)

function createRow (i) {
  var el = html`<div>this is row ${i}</div>`
  el.style.height = '30px'
  el.id = `id-${i}`
  return el
}

var tree = infiniteElements(rows, {
  height: 300,
  rowHeight: 30
})

document.body.appendChild(tree)
