const PROD = `
 __
(_ \\
  \\ \\_.----._
   \\         \\
    |  ) |  ) \\__
    |_|--|_|'-.__\\

`

const DEV = `
 __
(_ \\
  \\ \\_/\\/\\/\\_
   \\         |_
    |  ) |  )  |_
    |_|--|_|'-.__\\

`

/**
 * Util: Check Is Object Is Empty
 *
 * @param {Object} obj Object
 * @returns {Boolean} Is Empty (Or Not)
 */
export function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Util: Convert Bearer To Token (And More)
 *
 * @param {String} bearer Bearer
 * @returns {Array<String>} [Token, Header, Payload, Signature]
 */
export function convertBearerToToken(bearer: string): string[] {
  const token = bearer.replace(/Bearer\s/g, '')

  return [token, ...token.split('.')]
}

/**
 * Util: Display Dinosaur
 *
 * @param {Boolean} isProdEnv Is Prod Environment (Or Not)
 * @returns {String} ASCII Dinosaur
 */
export function displayDinosaur(isProdEnv = false): string {
  if (isProdEnv) {
    return PROD
  }

  return DEV
}

/**
 * Util: Format Date
 *
 * @param date Date
 * @returns {String} Formated Date (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  const dayOfTheMonth = date.getDate()
  const month = date.getMonth() + 1
  const fullYear = date.getFullYear()

  return `${dayOfTheMonth}/${month}/${fullYear}`
}

/**
 * Util: Format Clock
 *
 * @param date Date
 * @returns {String} Formated Clock (HH:mm:ss)
 */
export function formatClock(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${hours}:${minutes}:${seconds}`
}

/**
 * Util: Convert Timestamp To Millis
 *
 * @param {Number} timestamp Timestamp
 * @returns {Number} Millis
 */
export function timestampToMillis(timestamp: number): number {
  return timestamp * 1000
}

/**
 * Util: Convert Millis To Minutes
 *
 * @param {Number} millis Millis
 * @param {Boolean} rounded Rounded (Default: 'true')
 * @returns {Number} Minutes
 */
export function millisToMinutes(millis: number, rounded = true): number {
  if (rounded) {
    return Math.round(millis / (60 * 1000))
  }

  return millis / (60 * 1000)
}

export function paddingLeft({ text = '', maxLength = 10, char = ' ' }, prefix?: string): string {
  if (prefix) {
    return prefix + text.padStart(maxLength - prefix.length, char)
  }

  return text.padStart(maxLength, char)
}

export function isId(id: string): boolean {
  return id ? !!id.match(/^[0-9a-fA-F]{24}$/) : false
}
