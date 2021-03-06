import { MapDemo } from './mapDemo'

export function hub (parentResolver) {
  const resolver = parentResolver.forge({
    strategy: {
      MapDemo: {
        method: 'component'
      }
    },
    factory: new ComponentFactory()
  })

  return resolver.resolve('MapDemo')
}

export class ComponentFactory {
  /** @param {string} method */
  extract (method) {
    return this[`_${method}`]
  }

  _component () {
    return new MapDemo()
  }
}
