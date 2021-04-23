const fs = require("fs");
const archieml = require("archieml");
const request = require("request");
const htmlparser = require('htmlparser2');
const {decode} = require('html-entities');
const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/src/meta.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
const { doc } = CONFIG.google;
const makeRequest = (opt, cb) => {
  const url = `https://docs.google.com/document/d/${opt.id}/export?format=html`;
  request(url, (error, response, body) => {
    if (error) console.log(error);
    else if (response) {
      let parsed
      const parser = new htmlparser.Parser(new htmlparser.DomHandler(function (error, dom) {
      if (error) console.log(error)
      else {
        const tagHandlers = {
          _base: function (tag) {
            let str = '';
            tag.children.forEach(function(child) {
              if (func = tagHandlers[child.name || child.type]) str += func(child);
            });
            return str;
          },
          text: function (textTag) {
            return textTag.data;
          },
          span: function (spanTag) {
            return tagHandlers._base(spanTag);
          },
          p: function (pTag) {
            return tagHandlers._base(pTag) + '\n';
          },
          a: function (aTag) {
            let href = aTag.attribs.href
            if (href === undefined) return '';
            if (href && href.includes('://www.') && new URL(href) && new URL(href).searchParams.get('q')) {
              href = new URL(href).searchParams.get('q')
            }
            return `<a href="${href}">${tagHandlers._base(aTag)}</a>`;
          },
          li: function (tag) {
            return '* ' + tagHandlers._base(tag) + '\n';
          },
          b: function (bTag) {
            return `<b>${tagHandlers._base(bTag)}</b>`
          }
        };
        ['ul', 'ol'].forEach(function(tag) {
          tagHandlers[tag] = tagHandlers.span;
        });
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
          tagHandlers[tag] = tagHandlers.p;
        });
        const body = dom[0].children[1];
        let parsedText = tagHandlers._base(body);
        // Convert html entities into the characters as they exist in the google doc
        parsedText = decode(parsedText);
        // Remove smart quotes from inside tags
        parsedText = parsedText.replace(/<[^<>]*>/g, function(match){
          return match.replace(/"|"/g, '"').replace(/'|'/g, "'");
        });
        parsed = JSON.stringify(archieml.load(parsedText))
      }
      }));
      parser.write(body);
      parser.done()
      const file = `${CWD}/${opt.filepath || 'src/data/copy.json'}`;
      fs.writeFile(file, parsed, err => {
        if (err) console.error(err);
        cb();
      });
    }
  });
};
function init() {
  let i = 0;
  const next = () => {
    const d = doc[i];
    if (d.id)
      makeRequest(d, () => {
        i += 1;
        if (i < doc.length) next();
        else process.exit();
      });
  };
  next();
}
init();