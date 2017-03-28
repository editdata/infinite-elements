var html = require('bel')
var morph = require('nanomorph')
var debounce = require('debounce')

module.exports = function infiniteElements (elements, options) {
  var rows = elements || []
  var containerHeight = options.height
  var rowHeight = options.rowHeight
  var renderTop = 0
  var renderBottom = 0
  var scrollTop = 0
  var classList = options.class ? 'container ' + options.class : 'container'
  var eachRow = options.eachRow

  var tree = html`<div class="${classList}" onscroll=${debounce(onscroll, 50)}></div>`

  function render (rows) {
    console.time('infiniteElements:render')
    var rowsToRender = fillRenderArea(rows)

    var el = html`<div class="inner-wrapper" style="height:100%;">
      ${topRow()}
      ${rowsToRender.map(eachRow)}
      ${bottomRow()}
    </div>`

    var wrapper = tree.querySelector('.inner-wrapper')
    if (wrapper) {
      tree.replaceChild(el, wrapper)
    } else {
      tree.appendChild(el)
    }

    tree.style.height = options.height + 'px'
    tree.style['overflow-y'] = 'scroll'

    var container = document.querySelector('.container')

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
    var row = html`<div></div>`
    row.style.height = (renderTop * rowHeight) + 'px'
    return row
  }

  function bottomRow () {
    var row = html`<div></div>`
    row.style.height = ((rows.length - renderBottom) * rowHeight) + 'px'
    return row
  }

  function onscroll () {
    scrollTop = this.scrollTop
    render(rows)
  }

  function fillRenderArea (rows) {
    var total = rows.length
    var rowsPerBody = Math.floor(containerHeight / rowHeight)
    renderTop = Math.round(Math.max(0, Math.floor(scrollTop / rowHeight) - rowsPerBody * 1.2))
    renderBottom = Math.round(Math.min(renderTop + 4 * rowsPerBody, total))
    var sliced = rows.slice(renderTop, renderBottom)
    return sliced
  }

  return render(rows)
}
