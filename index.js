
class Test {

	constructor( name = '#Untitled', fn = null, inject = {} ) {
		this._ = {
			name,
			fn,
			inject,
			runs: [],
			iterations: 0
		}
	}

	_run() {
		let t, v, ms, ns,
			{ name, fn, iterations, inject } = this._

		t = process.hrtime()
		
		v = fn(name, iterations, inject)
		
		;[ ms, ns ] = process.hrtime(t)

		this._.runs[iterations] = {
			iteration: iterations,
			value: v,
			ms,
			ns
		}
		
		++this._.iterations
	}

	run( iterations = 1 ) {
		for( let i = 0; i < iterations; ++i ) {
			this._run()
		}

		return this
	}

	reset() {
		Object.assign(this._, {
			runs: [],
			iterations: 0
		})

		return this
	}

	name( name = '' ) {
		if( name ) {
			this._.name = name
		}

		return this._.name
	}

	results() {
		return this._.runs.slice()
	}

}


class Suite {

	constructor( name ) {
		this._ = {
			name,
			iterations: 100,
			tests: new Map()
		}
	}

	test( name, fn, inject ) {
		if( !this._.tests.has(name) ) {
			this._.tests.set(name, new Test(name, fn, inject))

			return this
		}

		return this._.tests.get(name)
	}

	run() {
		for( let test of this._.tests.values() ) {
			test.run(this._.iterations)
		}
	}

	results() {
		let results = new Map()

		for( let [ name, test ] of this._.tests.entries() ) {
			results.set(name, test.results())
		}

		return results
	}

}


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

	name( name = '' ) {
		if( name ) {
			this._.name = name
		}

		return this._.name
	}

	firstRun() {
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
	}

}

module.exports = Bench
