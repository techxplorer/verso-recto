/**
 * @file The defintition of the default migrate command class.
 */
import chalk from "chalk";

import ContentList from "../lib/content-list.js";
import PostCopier from "../lib/post-copier.js";

/**
 * Command to migrate the content from one directory to another.
 */
class Migrate {

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
   * Construct a new object to migrate content from the verso to recto path.
   * @param {string} versoPath The path on the 'left' / source side of the copy.
   * @param {string} rectoPath The path on the 'right' / destnation side of the copy.
   */
  constructor( versoPath, rectoPath ) {

    this.versoPath = versoPath;
    this.rectoPath = rectoPath;

  }

  /**
   * Run the command.
   */
  async run() {

    console.log( chalk.bold( "Migrating content..." ) );

    // Get a list of all of the content to migrate.
    const versoContent = new ContentList( this.versoPath );
    await versoContent.loadContents();
    const versoPostContent = await versoContent.getContents();
    const versoPostCount = await versoContent.getContentsCount();

    // Initialise the post copier.
    const postCopier = new PostCopier( this.versoPath, this.rectoPath );

    console.log( `Preparing to migrate ${ versoPostCount } posts...` );

    for ( let content of versoPostContent ) {

      console.log( `Migrating: ${ content }` );

      const blogPost = await versoContent.getBlogPost( content );

      await postCopier.copyPost( blogPost );

    }

    console.log(
      chalk.green( "Success! " ) +
      chalk.white( `Migrated: ${ versoPostCount } posts` )
    );
  }

}

export default Migrate;
