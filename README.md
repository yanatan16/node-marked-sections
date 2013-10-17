# marked-sections

A simple node.js package to use [marked](https://github.com/chjj/marked) to parse markdown and insert `<section>` tags around heading levels.

## Usage

```javascript
var mdsec = require('marked-sections');

mdsec.setOptions({
	levels: 2,
	hierarchy: false,
	deep: false,
	// marked options too
	gfm: true // see marked for full docs
});

html = mdsec.parse(markdownText);
html2 = mdsec.parse(markdownText, { hierarchy: true }); // change options

// Or you can do it manually
tree = mdsec.marked.lexer(markdownText);
sectree = mdsec.sectionalize(tree);
html = mdsec.marked.parser(sectree);
```

## Options

`marked-sections` takes two options above and beyond marked.

- `levels` refers to the header levels to wrap in sections. It should be the highest header level that should be wrapped in a section.
- `hierarchy` will make each level of header wrapped in a hierarchy of section tags. Defaults to false.
- `deep` will make a all hierarchy `levels` deep. Defaults to false.
- `promoteHr` will promote HR's outside of the sections (level 0). Defaults to true.

For example, with hierarchy on:

	```
	# H1
	something
	## H2
	else
	# H1
	again
	```

	becomes

	```
	<section>
		<h1>H1</h1>
		<p>something</p>
		<section>
			<h2>H2</h2>
			<p>else</p>
		</section>
	</section>
	<section>
		<h1>H1</h1>
		<p>again</p>
	</section>
	```

## License

MIT Licensed 2013 Jon Eisen.