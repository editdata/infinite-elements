# infinite-elements

A reusable module for creating infinite lists of elements where only the visible rows are rendered.

## Work in progress

This is an early version that could likely break or have breaking changes!

## Known issues

- this does not yet work with rows of variable height

## Install

```sh
npm install --save infinite-elements
```

## Usage

```js
var html = require('bel')
var infiniteElements = require('infinite-elements')

var rows = []

// generate some rows for demonstration purposes
for (var i = 0; i < 500; i++) {
  // setting an ID is required!
  var el = html`<div id="row-${i}" style="height: 30px;">
    this is row ${i}
  </div>` 

  rows.push(el)
}

var tree = infiniteElements(rows, {
  height: 300,
  rowHeight: 30
})

document.body.appendChild(tree)

// If you need to rerender the list:
tree.render(rows)
// useful if you add/remove/change elements in the rows array
```

## Examples
- [Basic example](example.js)

## See also

This module is inspired by / partially extracted from [view-list](https://npmjs.com/view-list).

- [view-list](https://npmjs.com/view-list)
- [csv-viewer](https://npmjs.com/csv-viewer)

## License

[MIT](LICENSE.md)
