/**
 * @file The defintion of the Post class.
 */

import { lstatSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import slug from "slug";

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
   * A list of media co-located with the post.
   * @type {Array}
   */
  postMedia = [];

  /**
   * The content of the new post including front matter and content.
   * @type {object}
   */
  newPostContent = null;

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

    this.postMedia = await readdir(
      this.postPath
    );

    this.postMedia = this.postMedia.filter( mediaFile => {
      if ( path.extname( mediaFile ) === ".jpeg" ) {
        return true;
      } else if ( path.extname( mediaFile ) === ".jpg" ) {
        return true;
      } else {
        return false;
      }
    } );
  }

  /**
   * Convert the post from the old to the new format.
   */
  convertPost() {

    // Copy the content of the post.
    this.newPostContent = {};
    this.newPostContent.content = this.postContent.content;

    // Tidy up the content a little by remove multiple consecutive blank lines.
    this.newPostContent.content = this.newPostContent.content.replace(
      /(\r?\n){2,}/g,
      "\n\n"
    );

    // Build the new front matter
    const frontMatter = {};

    frontMatter.title = this.postContent.data.title;

    if ( this.postContent.data.description !== undefined ) {
      frontMatter.description = this.postContent.data.description;
    }

    frontMatter.date = this.postContent.data.date;
    frontMatter.slug = slug( this.postContent.data.title );
    frontMatter.taxonomies = {};
    frontMatter.taxonomies.tags = this.postContent.data.tags;

    // Add extra options for the theme to use.
    frontMatter.extra = {};
    frontMatter.extra.show_reading_time = false;

    // finalise the post content
    this.newPostContent.data = frontMatter;

  }

}

export default BlogPost;
