const Handlebars = require('handlebars')

module.exports = {
  ai2html: function(path) {
    const partial = Handlebars.partials[path]
    const content = partial() // .replace(/src="images/g, 'src="../assets/images')
    const html = `
            ${content}`
    return new Handlebars.SafeString(html)
  }
}
