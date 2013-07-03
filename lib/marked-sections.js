// markedSections.js
// A section-wrapping parser for markdown that uses marked

var marked = require('marked'),
		_ = require('underscore');

module.exports = {
	marked: marked,
	setOptions: mergeOptions,
	parse: parse,
	sectionalize: sectionalize
};

var options = {
	levels: 2,
	heirarchy: false,
	deep: false
};

function parse(text, opts) {
	if (opts) {
		mergeOptions(opts);
	}

	return marked.parser(sectionalize(marked.lexer(text)));
}

function sectionalize(tree) {
	var indexes = _.filter(_.map(tree, function (subtree, i) {
		if (isHeader(subtree)) {
			return {i:i,d:subtree.depth};
		}
		return null;
	}), _.identity);

	_.each(indexes.slice(1).reverse(), function (ind, i) {
		tree.splice(ind.i, 0, middleTag(indexes[indexes.length - i - 2].d, ind.d));
	});

	if (indexes.length) {
		tree.splice(0, indexes[0].i, openTag(indexes[0].d));
		tree.splice(tree.length, 0, closeTag(indexes[indexes.length-1].d));

	}

	return tree;
}

function mergeOptions(opts) {
	options.levels = opts.levels || options.levels;
	options.heirarchy = opts.heirarchy !== undefined ? opts.heirarchy : options.heirarchy;
	options.deep = opts.deep !== undefined ? opts.deep : options.deep;

	marked.setOptions(opts);
}

function openTag(n) {
	return htmlTag(_.repeat('<section>', options.heirarchy ? (options.deep ? options.levels : n) : 1).join(''));
}

function closeTag(n) {
	return htmlTag(_.repeat('</section>', options.heirarchy ? (options.deep ? options.levels : n) : 1).join(''));
}

function middleTag(a, b) {
	if (options.heirarchy && !options.deep) {
		if (a === b) {
			return htmlTag('</section><section>')
		} else if (a < b) {
			return openTag(b - a);
		} else {
			return htmlTag(_.repeat('</section>', a - b + 1).concat(['<section>']).join(''));
		}
	}
	var tags = options.heirarchy ? options.levels - b + 1 : 1;
	return htmlTag(_.repeat('</section>', tags).concat(_.repeat('<section>', tags)).join(''));
}

function htmlTag(text) {
	return {
		type:'html',
		pre:true,
		text: text
	};
}

function isHeader (obj) {
	return obj.type === 'heading' && obj.depth <= options.levels;
}

_.mixin({
	repeat: function (v, n) {
		return _.map(_.range(n||1), function () {
			return v;
		});
	},
	identity: function (v) {
		return v;
	}
});