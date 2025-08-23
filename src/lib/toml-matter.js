/**
 * @file The definition of the TOML matter class.
 */

import { parse, serialize, validate } from "matter-toml";

/**
 * A convenience class to help namespace the different matter-* functions.
 */
class TomlMatter {

  static parse = parse;
  static serialize = serialize;
  static validate = validate;

}

export default TomlMatter;
