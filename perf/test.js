const
	Bench = require('../')

const
	fresh = new Bench('Fresh')

fresh
	.suite('Smells')
	.test('#fantastic', () => {
		return 237 + 9
	})
	.test('#reward', () => {
		return 7 + 9
	})

fresh
	.mark()
	.forEach(( data ) => {
		let	{	benchName,
				suiteName,
				testName,
			} = data

		console.log(`${benchName} | ${suiteName} | ${testName}`)
	})
