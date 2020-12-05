var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
const { registerHelper } = require('handlebars');
const { compileSassAndSaveMultiple } = require('compile-sass');

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

Handlebars.registerHelper( 'isEmpty', function( data, opts ) {
  if (Array.isArray(data) && data.length > 0 || Object.keys(data).length > 0) {
      return data;
  }
  return opts.fn(data);;
});

Handlebars.registerHelper( 'debugVariable', function( data, breakpoint ) {
    console.log(data);
    if (breakpoint === true) {
        debugger;
    }
    return '';
});

Handlebars.registerHelper('ifIn', function(elem, list, options) {
  if(list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

function render(resume) {
  var css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
  var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  var partialsDir = path.join(__dirname, 'partials');
  var partialsOther = path.join(__dirname, 'partials-other');
  registerPartial(partialsDir);
  registerPartial(partialsOther);
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

function registerPartial(partialsDir) {
  const filenames = fs.readdirSync(partialsDir);
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
}

module.exports = {
  render: render
};
