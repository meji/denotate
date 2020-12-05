import { colors } from "../../deps.ts";

/**
 * Util: Is Empty Object
 *
 * @param {Object} obj Object
 * @returns {Boolean} Is Empty (Or Not)
 */
export function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Util: Convert Bearer To Token (And More)
 *
 * @param {String} bearer Bearer
 * @returns {Array<String>} [Token, Header, Payload, Signature]
 */
export function convertBearerToToken(bearer: string): string[] {
  const token = bearer.replace(/Bearer\s/g, "");

  return [token, ...token.split(".")];
}

/**
 * Util: Display Dinosaur
 *
 * @param {Boolean} isProdEnv Is Prod Environment (Or Not)
 * @returns {String} ASCII Dinosaur
 */

const PROD = `
                         .       .
                        / \`.   .' \\
                .---.  <    > <    >  .---.
                |    \\  \\ - ~ ~ - /  /    |
                 ~-..-~             ~-..-~
             \\~~~\\.'                    \`./~~~/
   .-~~^-.    \\__/                        \\__/
 .'  O    \\     /               /       \\  \\
(_____,    \`._.'               |         }  \\/~~~/
 \`----.          /       }     |        /    \\__/
       \`-.      |       /      |       /      \`. ,~~|
           ~-.__|      /_ - ~ ^|      /- _      \`..-'   f: f:
                |     /        |     /     ~-.     \`-. _||_||_
                |_____|        |_____|         ~ - . _ _ _ _ _>

`;

const DEV = `
                                                     ___._
                                                   .'  <0>'-.._
                                                  /  /.--.____")
                                                 |   \\   __.-'~
                                                 |  :  -'/
                                                /:.  :.-'
__________                                     | : '. |
'--.____  '--------.______       _.----.-----./      :/
        '--.__            \`'----/       '-.      __ :/
              '-.___           :           \\   .'  )/
                    '---._           _.-'   ] /  _/
                         '-._      _/     _/ / _/
                             \\_ .-'____.-'__< |  \\___
                               <_______.\\    \\_\\_---.7
                              |   /'=r_.-'     _\\\\ =/
                          .--'   /            ._/'>
                        .'   _.-'
                       / .--'
                      /,/
                      |/\`)
                      'c=,

`;
export function displayDinosaur(isProdEnv = false): void {
  if (isProdEnv) {
    return console.log(colors.green(PROD));
  }
  return console.log(colors.brightMagenta(DEV));
}

/**
 * Util: Format Date
 *
 * @param date Date
 * @returns {String} Formated Date (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  const dayOfTheMonth = date.getDate();
  const month = date.getMonth() + 1;
  const fullYear = date.getFullYear();

  return `${dayOfTheMonth}/${month}/${fullYear}`;
}

/**
 * Util: Format time
 *
 * @param date Date
 * @returns {String} Formated Clock (HH:mm:ss)
 */
export function formatClock(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Util: Turn timestmp to mills
 *
 * @param {Number} timestamp Timestamp
 * @returns {Number} Millis
 */
export function timestampToMillis(timestamp: number): number {
  return timestamp * 1000;
}

/**
 * Util: Convert Milisec to Minutes
 *
 * @param {Number} millis Millis
 * @param {Boolean} rounded Rounded (Default: 'true')
 * @returns {Number} Minutes
 */
export function millisToMinutes(millis: number, rounded = true): number {
  if (rounded) {
    return Math.round(millis / (60 * 1000));
  }

  return millis / (60 * 1000);
}

/**
 * Util: Paint string with padding
 *
 * @param {text} string
 * @param {maxLength} number
 * @param {char} string
 * @param {prefix} string
 * @returns string con padding
 */
export function paddingLeft(
  { text = "", maxLength = 10, char = " " },
  prefix?: string
): string {
  if (prefix) {
    return prefix + text.padStart(maxLength - prefix.length, char);
  }

  return text.padStart(maxLength, char);
}

/**
 * Util: check if ID is Hexadecimal and 24 digits
 *
 * @param {String} id
 * @returns {boolean}
 */

export function isId(id: string): boolean {
  return id ? !!id.match(/^[0-9a-fA-F]{24}$/) : false;
}

/**
 * Util: get Params from url without ?
 *
 * @param {String} url
 * @returns {boolean}
 */

export function getQueryParams(url: string): URLSearchParams | undefined {
  const params = url.split("?")[1];
  if (!params) return undefined;
  return new URLSearchParams(params);
}
