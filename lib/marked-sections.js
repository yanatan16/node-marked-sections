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
	deep: false,
	promoteHr: true
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
		} else if (isHr(subtree)) {
			return {i:i,d:0};
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
	_.extend(options, opts);

	marked.setOptions(opts);
}

function openTag(n) {
	return htmlTag(_.repeat('<section>', options.heirarchy ? (options.deep ? options.levels : n) : 1).join(''));
}

function closeTag(n) {
	return htmlTag(_.repeat('</section>', options.heirarchy ? (options.deep ? options.levels : n) : 1).join(''));
}

function middleTag(a, b) {
	var close = a - b + 1,
		open = 1;

	if (options.heirarchy && options.deep) {
		close = open = options.levels - b + 1;
	} else if (!options.heirarchy) {
		close = open = 1;
	}

	if (a === 0) {
		close = 0;
	}

	if (b === 0) {
		open = 0;
	}

	return htmlTag(_.repeat('</section>', close).concat(_.repeat('<section>', open)).join(''));
}

function htmlTag(text) {
	return {
		type:'html',
		pre:true,
		text: text
	};
}

function isHr (obj) {
	return options.promoteHr && obj.type === 'hr';
}

function isHeader (obj) {
	return obj.type === 'heading' && obj.depth <= options.levels;
}

_.mixin({
	repeat: function (v, n) {
		return _.map(_.range(n), function () {
			return v;
		});
	},
	identity: function (v) {
		return v;
	}
});