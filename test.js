class Test {

	constructor( name = '#Untitled', fn = null, injection = {} ) {
		this._ = {
			name,
			fn,
			injection,
			runs: [],
			iterations: 0
		}
	}

	_run() {
		let t, v, ms, ns,
			{ name, fn, iterations, injection } = this._

		t = process.hrtime()
		
		v = fn(name, iterations, injection)
		
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

	runs() {
		return this._.runs.slice()
	}

	data() {
		return Object.assign({}, this._, {
			runs: this.runs()
		})
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

}

module.exports = Test
