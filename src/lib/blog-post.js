/**
 * @file The defintion of the Post class.
 */

import { lstatSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import TomlMatter from "./toml-matter.js";
import YamlMatter from "./yaml-matter.js";

/**
 * Represent a post, including it's content and assets.
 */
class BlogPost {

  /**
   * Path to the blog post directory.
   * @type {string}
   */
  postPath = null;

  /**
   * The content of the post as parsed front matter and content.
   * @type {object}
   */
  postContent = {};

  /**
   * Construct a new object.
   * @param {string} postPath The path to the content directory.
   * @throws {TypeError} When the parameters are incorrect.
   */
  constructor( postPath ) {

    let syncStatus = null;

    try {
      syncStatus = lstatSync( postPath );
    } catch ( err ) {
      throw new TypeError( "Path not found", { "cause": err } );
    }

    if ( !syncStatus.isDirectory() ) {
      throw new TypeError( "Path must be a directory" );
    }

    const indexPath = path.join( postPath, "/index.md" );

    try {
      syncStatus = lstatSync( indexPath );
    } catch ( err ) {
      throw new TypeError(
        "Directory must contain an 'index.md' file",
        {
          "cause": err
        } );
    }

    this.postPath = postPath;

  }

  /**
   * Load the content of the post.
   * @throws {Error} When the post cannot be loaded.
   */
  async loadPost() {

    let postFileContent = await readFile(
      path.join(
        this.postPath,
        "/index.md"
      )
    );

    postFileContent = postFileContent.toString();

    if ( TomlMatter.validate( postFileContent ) === false ) {

      if ( YamlMatter.validate( postFileContent ) === false ) {
        throw new Error( "Post doesn't contain valid frontmatter" );
      } else {
        this.postContent = YamlMatter.parse( postFileContent );
      }

    } else {
      this.postContent = TomlMatter.parse( postFileContent );
    }
  }
}

export default BlogPost;
