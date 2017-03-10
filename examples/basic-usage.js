var html = require('yo-yo')

var infiniteElements = require('../index')

var i = 0
var l = 200
var rows = []

for (i; i < l; i++) {
  rows.push(i)
}

setInterval(function () {
  rows.push(rows.length)
  tree.render(rows)
}, 1000)

function eachRow (i) {
  return html`<div id="row-${i}" style="height: 30px;">
    this is row ${i}
  </div>`
}

var tree = infiniteElements(rows, {
  height: 300,
  rowHeight: 30,
  eachRow: eachRow
})

document.body.appendChild(tree)
