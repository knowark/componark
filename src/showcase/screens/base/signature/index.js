import { SignatureDemo } from './signatureDemo'

export function hub(parentResolver) {
  const resolver = parentResolver.forge({
    strategy: {
      SignatureDemo: {
        method: 'component'
      }
    },
    factory: new ComponentFactory()
  })

  return resolver.resolve('SignatureDemo')
}

export class ComponentFactory {
  constructor() {
    this._component['dependencies'] = []
  }

  /** @param {string} method */
  extract(method) {
    return this[`_${method}`]
  }

  _component() {
    return new SignatureDemo()
  }
}