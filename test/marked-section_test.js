
var mdsec = require('../lib/marked-sections');

var tests = module.exports = {};

tests.testBasicUse = function (test) {
	var text = '## header2\n- l1\n- l2';
	var output = mdsec.parse(text).replace(/[\n\t]/g, '');

	test.equal('<section><h2>header2</h2><ul><li>l1</li><li>l2</li></ul></section>', output);
	test.done();
}

tests.testMultiHeader = function (test) {
	var text = '# head1\ntest\n\n## head2\n- l1\n- l2\n\n# head12';
	var output = mdsec.parse(text).replace(/[\n\t]/g, '');

	test.equal('<section><h1>head1</h1><p>test</p></section><section><h2>head2</h2><ul><li>l1</li><li>l2</li></ul></section><section><h1>head12</h1></section>', output);
	test.done();
}

tests.testHeaderLevel = function (test) {
	var text = '# head1\ntest\n\n## head2\n- l1\n- l2\n\n# head12';
	var output = mdsec.parse(text, {levels: 1}).replace(/[\n\t]/g, '');

	test.equal('<section><h1>head1</h1><p>test</p><h2>head2</h2><ul><li>l1</li><li>l2</li></ul></section><section><h1>head12</h1></section>', output);
	test.done();
}

tests.testHeaderHeirarchy = function (test) {
	var text = '# head1\ntest\n\n## head2\n- l1\n- l2\n\n# head12';
	var output = mdsec.parse(text, {levels: 2, heirarchy: true}).replace(/[\n\t]/g, '');

	test.equal('<section><section><h1>head1</h1><p>test</p></section><section><h2>head2</h2><ul><li>l1</li><li>l2</li></ul></section></section><section><section><h1>head12</h1></section></section>', output);
	test.done();
}

tests.testSetOptions = function (test) {
	mdsec.setOptions({ levels: 1, heirarchy: false });
	var text = '# head1\ntest\n\n## head2\n- l1\n- l2\n\n# head12';
	var output = mdsec.parse(text).replace(/[\n\t]/g, '');

	test.equal('<section><h1>head1</h1><p>test</p><h2>head2</h2><ul><li>l1</li><li>l2</li></ul></section><section><h1>head12</h1></section>', output);
	test.done();
}