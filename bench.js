const
	Suite = require('./suite.js')

class Bench {
	
	constructor( name ) {
		this._ = {
			name,
			suites: new Map()
		}
	}

	_time( ms = 0, ns = 0 ) {
		return ms + ns / 1e6
	}

	suite( name ) {
		if( !this._.suites.has(name) ) {
			this._.suites.set(name, new Suite(name))
		}

		return this._.suites.get(name)
	}

	mark() {
		for( let suite of this._.suites.values() ) {
			suite.run()
		}

		return this
	}

	forEach( fn ) {
		let	suiteData,
			testData,
			benchName = this.name(),
			suiteCount = this._.suites.size,
			suiteNumber = 0
		
		for( let [ suiteName, suite ] of this._.suites.entries() ) {
			let	testCount,
				testNumber = 0

			++suiteNumber
			suiteData = suite.data()
			testCount = suiteData.tests.size
			
			for( let [ testName, test ] of suiteData.tests.entries() ) {				
				++testNumber
				testData = test.data()

				fn({
					benchName,
					suiteName,
					testName,
					suiteData,
					suiteNumber,
					suiteCount,
					testData,
					testNumber,
					testCount
				})
			}
		}
	}

	name( name = '' ) {
		if( name ) {
			this._.name = name
		}

		return this._.name
	}

	/*firstRun() {
		let	suiteResults,
			testResults,
			firstRun = []
		
		for( let [ suiteName, suite ] of this._.suites.entries() ) {
			suiteResults = suite.results()
			
			for( let [ testName, testResults ] of suiteResults.entries() ) {
				let { ms, ns } = testResults[0]
				
				firstRun.push(`${this.name()} - ${suiteName} - ${testName} time: ${this._time(ms, ns)}`)
			}
		}

		firstRun.forEach(( v ) => {
			console.log(v)
		})

		return this
	}*/

}

module.exports = Bench
