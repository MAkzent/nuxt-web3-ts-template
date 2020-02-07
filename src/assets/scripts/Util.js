import uniq from 'lodash/uniq'
import flattenDepth from 'lodash/flattenDepth'
import cloneDeep from 'lodash/cloneDeep'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock'

export default class Util {
  getCookieMaxAge (type) {
    const maxAges = new Map([
      ['oneWeek', 60 * 60 * 24 * 7],
      ['oneMonth', 60 * 60 * 24 * 30],
      ['oneYear', 60 * 60 * 24 * 365],
      ['tenYears', 60 * 60 * 24 * 365 * 10]
    ])
    if (!Array.from(maxAges.keys()).includes(type)) {
      throw new Error('Invalid max age type.')
    }
    return maxAges.get(type)
  }

  uniq (array) {
    if (Set) {
      return [...new Set(array)]
    }
    return uniq(array)
  }

  flat (array, depth = 1) {
    if (array.flat) {
      return array.flat(depth)
    }
    return flattenDepth(array, depth)
  }

  clone (object) {
    return cloneDeep(object)
  }

  camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
  }

  sortByNumberAsc (p, c) {
    if (p < c) { return -1 }
    if (p > c) { return 1 }
    return 0
  }

  sortByNumberDesc (p, c) {
    if (p > c) { return -1 }
    if (p < c) { return 1 }
    return 0
  }

  bodyScrollLockOn (elem) {
    disableBodyScroll(elem)
  }

  bodyScrollLockOff (elem) {
    enableBodyScroll(elem)
  }

  bodyScrollLockClear () {
    clearAllBodyScrollLocks()
  }
}
