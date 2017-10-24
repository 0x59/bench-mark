const
	util = {
		
		makeNonEnumProp( obj, prop, value ) {
			Object.defineProperty(obj, prop, {
				value: value,
				writable: true,
				configurable: true,
				enumerable: false
			})
		},
		
		addMsNs( ms = 0, ns = 0 ) {
			return ms + ns / 1e6
		}

	}

module.exports = util
