const
	Test = require('./test.js')

class Suite {

	constructor( name ) {
		this._ = {
			name,
			iterations: 100,
			tests: new Map()
		}
	}

	test( name, fn, injection ) {
		if( !this._.tests.has(name) ) {
			this._.tests.set(name, new Test(name, fn, injection))

			return this
		}

		return this._.tests.get(name)
	}

	run() {
		for( let test of this._.tests.values() ) {
			test.run(this._.iterations)
		}
	}

	runs() {
		let runs = new Map()

		for( let [ name, test ] of this._.tests.entries() ) {
			runs.set(name, test.runs())
		}

		return runs
	}

	data() {
		return Object.assign({}, this._, {
			tests: new Map(this._.tests)
		})
	}

}

module.exports = Suite
