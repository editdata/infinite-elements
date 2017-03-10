var html = require('yo-yo')
var css = require('sheetify')
var request = require('xhr')

var infiniteElements = require('../index')

request({ url: 'http://127.0.0.1:9966/data/seattle-library-checkouts.json', json: true }, function (err, res, body) {
  var count = body.length

  var layout = createLayout({
    height: 200,
    rowHeight: 50
  })

  console.time('grid')
  var tree = html`
  <div style="height:100%''">
    ${layout(body)}
    <p>Seattle Library book checkouts by title. <b>${count} rows</b></p>
  </div>`
  console.timeEnd('grid')
  document.body.appendChild(tree)
})

css`
 body, html {
   height: 100%;
   padding: 0px;
   margin: 0px;
 }

 .data-grid-cell {
   display: inline-block;
   font-size: 12px;
   border: 0px;
   padding: 0px 8px;
   margin: 0px;
   width: 150px;
   background: none;
   resize: none;
   border-right: 1px solid #ccc;
   border-bottom: 1px solid #ccc;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   -o-text-overflow: ellipsis;
 }
`

function createLayout (options) {
  var prefix = css`
    :host {
      position: relative;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 100%;
    }
  `

  var headers = createHeaders(options)
  var rows = createRows(options)

  return function render (data) {
    var el = html`<div class="data-grid ${prefix}">
      ${headers(data)}
      ${rows(data)}
    </div>`
    el.style.height = (options.height + options.rowHeight * 2) + 'px'
    return el
  }
}

function createHeaders (options) {
  var rowHeight = options.rowHeight

  var prefix = css`
    :host {
      white-space: nowrap;
      margin: 0px;
      padding: 0px;
    }
  `

  var header = createHeader(options)

  function render (rows) {
    var keys = Object.keys(rows[0])

    function prop (key) {
      return header(key)
    }

    var el = html`<ul class="data-grid-headers ${prefix}">
      ${keys.map(prop)}
    </ul>`

    el.style.height = rowHeight + 'px'
    return el
  }

  return render
}

function createHeader (options) {
  var rowHeight = options.rowHeight

  var prefix = css`
    :host {
      width: 150px;
      line-height: 50px;
      padding: 0px 8px;
      display: inline-block;
      font-size: 15px;
      list-style-type: none;
      overflow-x: hidden;
      font-weight: 700;
      border-right: 1px solid #aaa;
      border-bottom: 1px solid #888;
      cursor: pointer;
    }
  `

  function render (key) {
    var el =  html`<div class="data-grid-header ${prefix}">
      <span class="data-grid-header-key">${key}</span>
    </div>`

    el.style.height = rowHeight + 'px'
    return el
  }

  return render
}

function createRows (options) {
  console.time('grid:createRows')
  var height = options.height
  var rowHeight = options.rowHeight

  var prefix = css`
    :host {
      margin: 0px;
      padding: 0px;
      overflow-y: scroll;
      position: absolute;
      white-space: nowrap;
      height: 100%;
    }
  `

  function row (data, i) {
    console.time('grid:row')
    var cells = []
    var keys = Object.keys(data)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      cells.push(cell({ key: keys[i], value: data[keys[i]] }))
    }

    var el = html`<div id="row-${i}" class="data-grid-row">
      ${cells}
    </div>`

    el.style['list-style-type'] = 'none'
    el.style.height = rowHeight + 'px'
    console.timeEnd('grid:row')
    return el
  }

  function cell (state) {
    var el = html`<div class="data-grid-cell">
      ${state.value}
    </div>`

    el.style.height = rowHeight + 'px'
    el.style['line-height'] = rowHeight + 'px'
    el.style['max-height'] = rowHeight + 'px'
    el.style['min-height'] = rowHeight + 'px'
    return el
  }

  function render (rows) {
    options.eachRow = function (data, i) {
      return row(data, i)
    }

    options.class = prefix
    var result = infiniteElements(rows, options)
    console.timeEnd('grid:createRows')
    return result
  }

  return render
}
