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
	heirarchy: false
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

	_.each(indexes.slice(1).reverse(), function (ind) {
		tree.splice(ind.i, 0, middleTag(ind.d));
	});

	tree.splice(0, (indexes[0] && indexes[0].i) || 0, openTag());
	tree.splice(tree.length, 0, closeTag());

	return tree;
}

function mergeOptions(opts) {
	options.levels = opts.levels || options.levels;
	options.heirarchy = opts.heirarchy || options.heirarchy;

	marked.setOptions(opts);
}

function openTag() {
	return htmlTag(_.repeat('<section>', options.heirarchy ? options.levels : 1).join(''));
}

function closeTag() {
	return htmlTag(_.repeat('</section>', options.heirarchy ? options.levels : 1).join(''));
}

function middleTag(lvl) {
	var tags = options.heirarchy ? options.levels - lvl + 1 : 1;
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