var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');

Handlebars.registerHelper('debugContext', function (optionalValue) {
  console.log('Current Context');
  console.log('====================');
  console.log(this);

  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log(optionalValue);
  }
});

Handlebars.registerHelper( 'debugVariable', function( data, breakpoint ) {
    console.log(data);
    if (breakpoint === true) {
        debugger;
    }
    return '';
});

function render(resume) {
  var css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
  var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  var partialsDir = path.join(__dirname, 'partials');
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var filepath = path.join(partialsDir, filename);
    var template = fs.readFileSync(filepath, 'utf8');

    Handlebars.registerPartial(name, template);
  });
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

module.exports = {
  render: render,
};
