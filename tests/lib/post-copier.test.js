import assert from "node:assert/strict";
import { lstatSync } from "node:fs";
import path from "node:path";
import { afterEach, before, describe, it } from "node:test";

import { rimraf } from "rimraf";

import PostCopier from "../../src/lib/post-copier.js";
import BlogPost from "../../src/lib/blog-post.js";

const testFailPathOne = "";
const testFailPathTwo = path.resolve( import.meta.dirname, "../../package.json" );
const testFailVersoPathMsgOne = "Verso path not found";
const testFailVersoPathMsgTwo = "Verso path must be a directory";
const testFailRectoPathMsgOne = "Recto path not found";
const testFailRectoPathMsgTwo = "Recto path must be a directory";
const testPassVersoPath = path.resolve( "tests/artefacts/verso" );
const testPassRectoPath = path.resolve( "tests/artefacts/recto" );

const testPassVersoPostPathOne = path.resolve( "tests/artefacts/verso/20160209-090107" );

/**
 * Helper function to tidy the archive directory.
 */
function tidyRectorDir() {
  rimraf.sync(
    testPassRectoPath + "/*",
    {
      preserveRoot: true,
      glob: true
    }
  );
}

describe( "PostCopier", () => {

  describe( "Constructor", () => {

    it( "should throw errors when paths are incorrect", () => {

      assert.throws(
        () => {
          new PostCopier(
            testFailPathOne,
            testPassRectoPath
          );
        },
        {
          name: "TypeError",
          message: testFailVersoPathMsgOne
        }
      );

      assert.throws(
        () => {
          new PostCopier(
            testFailPathTwo,
            testPassRectoPath
          );
        },
        {
          name: "TypeError",
          message: testFailVersoPathMsgTwo
        }
      );

      assert.throws(
        () => {
          new PostCopier(
            testPassVersoPath,
            testFailPathOne
          );
        },
        {
          name: "TypeError",
          message: testFailRectoPathMsgOne
        }
      );

      assert.throws(
        () => {
          new PostCopier(
            testPassVersoPath,
            testFailPathTwo
          );
        },
        {
          name: "TypeError",
          message: testFailRectoPathMsgTwo
        }
      );

    } );

    it( "should not throw errors when the paths are correct", () => {

      assert.doesNotThrow(
        () => {
          new PostCopier(
            testPassVersoPath,
            testPassRectoPath
          );
        }
      );
    } );

  } );

  describe( "copyPost", () => {

    before( () => {
      tidyRectorDir();
    } );

    afterEach( () => {
      tidyRectorDir();
    } );

    it( "should copy a post from the verso to the recto path", async() => {

      let blogPost = new BlogPost( testPassVersoPostPathOne );
      await blogPost.loadPost();

      const postCopier = new PostCopier(
        testPassVersoPath,
        testPassRectoPath
      );

      await postCopier.copyPost( blogPost );

      lstatSync(
        path.join(
          testPassRectoPath,
          path.basename(
            testPassVersoPostPathOne
          )
        )
      );

      lstatSync(
        path.join(
          testPassRectoPath,
          path.basename(
            testPassVersoPostPathOne
          ),
          "index.md"
        )
      );

      lstatSync(
        path.join(
          testPassRectoPath,
          path.basename(
            testPassVersoPostPathOne
          ),
          "20160209-090107+1030-ig.webp"
        )
      );

    } );

  } );

} );
