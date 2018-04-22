const UTIL = require('util')
const FS = require('fs')
const CONVERT = require('xml-js')
const WRITE = require('write-json-file')

const READ = UTIL.promisify(FS.readFile)

const getNames = async fp => READ(fp, 'utf8')
  .then(CONVERT.xml2js)
  .then(xml => {
    return xml.elements.find(i => i.name === 'glyphData').elements.reduce((names, e) => {
      names[e.attributes.unicode] = e.attributes.name
      return names
    }, {})
  })

const getAllNames = async () => Promise.all([
  getNames('node_modules/glyphs-info/GlyphData.xml'),
  getNames('node_modules/glyphs-info/GlyphData_Ideographs.xml')
])
  .then(promises => Object.assign(...promises))

// const removeUnicodeNames = (key, val) => {
//   if ('uni' + key === val || 'u' + key === val) return undefined
//   return val
// }

getAllNames()
  .then(names => WRITE('dist/names.json', names /*, { replacer: removeUnicodeNames } */))
