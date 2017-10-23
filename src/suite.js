const
	Test = require('./test.js')

class Suite {

	constructor( name ) {
		this._ = {
			name,
			iterations: 100,
			tests: new Map(),
			userData: {}
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

	data( userData ) {
		if( userData ) {
			Object.assign(this._.userData, userData)

		} else {
			return Object.assign({}, this._, {
				tests: new Map(this._.tests)
			})
		}
	}

	name( name = '' ) {
		if( name ) {
			this._.name = name
		}

		return this._.name
	}

	forEach( fn ) {
		let	data,
			testData,
			testNumber = 0,
			suiteName = this.name(),
			suiteData = this.data(),
			testCount = suiteData.tests.size
			
		for( let [ testName, test ] of suiteData.tests.entries() ) {				
			++testNumber
			testData = test.data()

			data = fn({
				suiteName,
				testName,
				suiteData,
				testData,
				testNumber,
				testCount
			})

			if( typeof data === 'object' ) {
				if( data.suite ) {
					this.data(data.suite)
					suiteData = this.data()
				}

				if( data.test ) {
					test.data(data.test)
				}
			}
		}

		return this
	}

}

module.exports = Suite
