/**
 * @file The defintion of the ContentList class.
 */

import { lstatSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

import BlogPost from "./blog-post.js";

/**
 * Maintain a list of content.
 */
class ContentList {

  /**
   * Path to the content directory.
   * @type {string}
   */
  contentPath = null;

  /**
   * An array of content in the archive.
   * @type {Array}
   */
  contents = Array();

  /**
   * A flag to indicate if the status cache is stale.
   * @type {boolean}
   */
  cacheStale = true;

  /**
   * Construct a new object.
   * @param {string} contentPath The path to the content directory.
   * @throws {TypeError} When the parameters are incorrect.
   */
  constructor( contentPath ) {

    let syncStatus = null;

    try {
      syncStatus = lstatSync( contentPath );
    } catch ( err ) {
      throw new TypeError( "Path not found", { "cause": err } );
    }

    if ( !syncStatus.isDirectory() ) {
      throw new TypeError( "Path must be a directory" );
    }

    this.contentPath = contentPath;

  }

  /**
   * Build the list of content in the content directory.
   * @returns {number} The number of content directories in the archive.
   */
  async loadContents() {

    if ( this.cacheStale === false ) {
      return this.contents.length;
    }

    this.contents = await readdir(
      this.contentPath,
      {
        withFileTypes: true
      }
    );

    this.contents = this.contents
      .filter( ( contentDir ) => {
        return contentDir.isDirectory();
      } )
      .map( ( contentDir ) => {
        return contentDir.name;
      } );

    this.cacheStale = false;
    return this.contents.length;

  }

  /**
   * Get the number of content items in the archive.
   * @returns {number} The number of content items in the archive.
   */
  async getContentsCount() {

    if ( this.cacheStale ) {
      await this.loadContents();
    }

    return this.contents.length;
  }

  /**
   * Get the array of content in the archive.
   * Uses the already loaded content list, or loads them if required.
   * @returns {Array} The array of statuses from the archive.
   */
  async getContents() {

    if ( this.cacheStale === false ) {
      return this.contents;
    }

    await this.loadContents();

    return this.contents;
  }

  /**
   * Return a post from the list of content
   * Uses the already loaded content list, or loads them if required.
   * @param {string} directoryName The name of the directory containing the post.
   * @returns {BlogPost} The array of statuses from the archive.
   * @throws {Error} When the post cannot be loaded.
   * @throws {TypeError} When the parameters are incorrect.
   */
  async getBlogPost( directoryName ) {

    if ( typeof directoryName != "string" || directoryName.length === 0 ) {
      throw new TypeError( "Directory name is expected to be a non-zero length string" );
    }

    const post = new BlogPost(
      path.join(
        this.contentPath,
        directoryName
      )
    );

    await post.loadPost();

    return post;

  }

}

export default ContentList;
