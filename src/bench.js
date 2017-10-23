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

	name( name = '' ) {
		if( name ) {
			this._.name = name
		}

		return this._.name
	}

	mark() {
		for( let suite of this._.suites.values() ) {
			suite.run()
		}

		return this
	}

	forEach( fn ) {
		let	data,
			userData,
			suiteData,
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

				data = fn({
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
				
				if( typeof data === 'object' ) {
					if( data.suite ) {
						suite.data(data.suite)
						suiteData = suite.data()
					}

					if( data.test ) {
						test.data(data.test)
					}
				}
			}
		}
	}

}

module.exports = Bench
