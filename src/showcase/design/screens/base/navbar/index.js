import { NavbarDemo } from './navbarDemo'

export function hub (parentResolver) {
  const resolver = parentResolver.forge({
    strategy: {
      NavbarDemo: {
        method: 'component'
      }
    },
    factory: new ComponentFactory()
  })

  return resolver.resolve('NavbarDemo')
}

export class ComponentFactory {
  /** @param {string} method */
  extract (method) {
    return this[`_${method}`]
  }

  _component () {
    return new NavbarDemo()
  }
}
