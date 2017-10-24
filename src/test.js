const
	_ = require('./util.js')

class Test {

	constructor( name = '#Untitled', fn = null, injection = {} ) {
		this._ = {
			name,
			fn,
			injection,
			iterations: 0
		}

		_.makeNonEnumProp(this._, 'runs', [])
		_.makeNonEnumProp(this._, 'userData', {})
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

	data( userData ) {
		if( typeof userData === 'object' ) {
			/*for( let p of Object.keys(userData) ) {
				this._.userData[p] = userData[p]
			}*/
			Object.assign(this._.userData, userData)

		} else {
			let ret = {}

			for( let p of Object.getOwnPropertyNames(this._) ) {
				if( p === 'runs' ) {
					ret[p] = this.runs()
				
				} else {
					ret[p] = this._[p]
				}
			}

			return ret
			/*return Object.assign({}, this._, {
				runs: this.runs()
			})*/
		}
	}

	reset() {
		Object.assign(this._, {
			runs: [],
			iterations: 0,
			userData: {}
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
