/**
 * @file The defintion of the PostCopier class.
 */
import { lstatSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { CWebp } from "cwebp";

import BlogPost from "./blog-post.js";
import TomlMatter from "../../src/lib/toml-matter.js";

/**
 * Copy posts from the verso to the recto directories.
 */
class PostCopier {

  /**
   * The path on the 'left' / source side of the copy.
   * @type {string}
   */
  versoPath = null;

  /**
   * The path on the 'right' / destnation side of the copy.
   * @type {string}
   */
  rectoPath = null;

  /**
   * Construct a new object.
   * @param {string} versoPath The path on the 'left' / source side of the copy.
   * @param {string} rectoPath The path on the 'right' / destnation side of the copy.
   * @throws {TypeError} When the parameters are incorrect.
   */
  constructor( versoPath, rectoPath ) {

    let syncStatus = null;

    try {
      syncStatus = lstatSync( versoPath );
    } catch ( err ) {
      throw new TypeError( "Verso path not found", { "cause": err } );
    }

    if ( !syncStatus.isDirectory() ) {
      throw new TypeError( "Verso path must be a directory" );
    }

    try {
      syncStatus = lstatSync( rectoPath );
    } catch ( err ) {
      throw new TypeError( "Recto path not found", { "cause": err } );
    }

    if ( !syncStatus.isDirectory() ) {
      throw new TypeError( "Recto path must be a directory" );
    }

    this.versoPath = versoPath;
    this.rectoPath = rectoPath;

  }

  /**
   * Copy a post from the verso to the recto path.
   * @param {BlogPost} post The BlogPost object representing the post to copy.
   */
  async copyPost( post ) {

    // Convert the post if necessary
    if ( post.newPostContent === null ) {
      post.convertPost();
    }

    // Make the new post directory
    const newPostPath = await mkdir(
      path.join(
        this.rectoPath,
        path.basename( post.postPath )
      ),
      { recursive: true }
    );

    // Write the index file
    await writeFile(
      path.join(
        newPostPath,
        "index.md"
      ),
      TomlMatter.serialize(
        post.newPostContent.data,
        post.newPostContent.content
      ),
      {
        flag: "wx"
      }
    );

    // Copy any co-located media and convert to webp along the way.
    if ( post.postMedia.length > 0 ) {

      for ( let media of post.postMedia ) {
        const versoMediaPath = path.join(
          post.postPath,
          media
        );

        const rectoMediaPath = path.join(
          newPostPath,
          path.parse( media ).name + ".webp"
        );

        const webpEncoder = new CWebp( versoMediaPath );
        webpEncoder.preset = "photo";
        webpEncoder.quality( 85 );

        await webpEncoder.write( rectoMediaPath );

      }
    }

  }

}

export default PostCopier;
