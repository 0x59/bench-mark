const
	Test = require('./test.js'),
	_ = require('./util.js')

const
	DEFAULT_MIN_AVG_ITER = 24,	// inclusive
	DEFAULT_MAX_AVG_ITER = 74,	// exclusive
	DEFAULT_ITERATIONS = 100

class Suite {

	constructor( name ) {
		this._ = {
			name,
			minAvgIter: DEFAULT_MIN_AVG_ITER,
			maxAvgIter: DEFAULT_MAX_AVG_ITER,
			iterations: DEFAULT_ITERATIONS
		}

		_.makeNonEnumProp(this._, 'tests', new Map())
		_.makeNonEnumProp(this._, 'userData', {})
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
		if( typeof userData === 'object' ) {
			/*for( let key of Object.keys(userData) ) {
				this._.userData[key] = userData[key]
			}*/
			Object.assign(this._.userData, userData)

		} else {
			let ret = {}

			for( let p of Object.getOwnPropertyNames(this._) ) {
				if( p === 'tests' ) {
					ret[p] = new Map(this._[p])
				
				} else {
					ret[p] = this._[p]
				}
			}

			return ret
			
			/*(return Object.assign({}, this._, {
				tests: new Map(this._.tests)
			})*/
		}
	}

	settings( settings ) {
		if( typeof settings === 'object' ) {
			for( let key of Object.keys(this._) ) {
				if( settings.hasOwnProperty(key) ) {
					this._[key] = settings[key]
				}
			}
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
