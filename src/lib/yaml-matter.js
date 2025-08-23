/**
 * @file The definition of the YamlMatter class.
 */

import { parse, serialize, validate } from "matter-yaml";

/**
 * A convenience class to help namespace the different matter-* functions.
 */
class YamlMatter {

  static parse = parse;
  static serialize = serialize;
  static validate = validate;

}

export default YamlMatter;
