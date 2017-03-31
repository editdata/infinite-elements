var assert = require('assert')
var html = require('bel')
var morph = require('nanomorph')
var debounce = require('debounce')

module.exports = function infiniteElements (options) {
  assert.equal(typeof options, 'object', 'inifite-elements: options object is required')
  var containerHeight = options.height
  var rowHeight = options.rowHeight
  var renderTop = 0
  var renderBottom = 0
  var scrollTop = 0
  var classList = options.class ? 'infinite-elements-container ' + options.class : 'infinite-elements-container'
  var eachRow = options.eachRow
  var rows

  var tree = html`<div class="${classList}" onscroll=${debounce(onscroll, 50)}></div>`

  function render (data) {
    rows = data
    console.time('infiniteElements:render')
    var slicedRows = fillRenderArea(rows)
    var rowsToRender = []
    var l = slicedRows.length
    var i = 0

    console.time('infiniteElements:slicedRows')
    for (i; i < l; i++) {
      rowsToRender[i] = eachRow(slicedRows[i], i)
    }
    console.timeEnd('infiniteElements:slicedRows')

    var el = html`<div class="infinite-elements-inner-wrapper" style="height:100%;">
      ${topRow()}
      ${rowsToRender}
      ${bottomRow(rows.length)}
    </div>`

    var wrapper = tree.querySelector('.infinite-elements-inner-wrapper')
    if (wrapper) {
      tree.replaceChild(el, wrapper)
    } else {
      tree.appendChild(el)
    }

    tree.style.height = options.height + 'px'
    tree.style['overflow-y'] = 'scroll'

    var container = document.querySelector('.infinite-elements-container')

    if (container) {
      console.time('infiniteElements:render:update')
      morph(container, tree)
      console.timeEnd('infiniteElements:render:update')
    }

    console.timeEnd('infiniteElements:render')
    tree.render = render
    return tree
  }

  function topRow () {
    var row = html`<div class="infinite-elements-top-row"></div>`
    row.style.height = (renderTop * rowHeight) + 'px'
    return row
  }

  function bottomRow (rowsLength) {
    var row = html`<div class="infinite-elements-bottom-row"></div>`
    row.style.height = ((rowsLength - renderBottom) * rowHeight) + 'px'
    return row
  }

  function onscroll () {
    scrollTop = this.scrollTop
    render(rows)
  }

  function fillRenderArea (rows) {
    console.time('infiniteElements:fillRenderArea')
    var total = rows.length
    var rowsPerBody = Math.floor(containerHeight / rowHeight)
    renderTop = Math.round(Math.max(0, Math.floor(scrollTop / rowHeight) - rowsPerBody * 1.2))
    renderBottom = Math.round(Math.min(renderTop + 4 * rowsPerBody, total))
    var sliced = rows.slice(renderTop, renderBottom)
    console.timeEnd('infiniteElements:fillRenderArea')
    return sliced
  }

  return render
}
