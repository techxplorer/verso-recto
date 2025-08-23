/* eslint-disable no-console */
import assert from "node:assert/strict";
import { lstatSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { isCI } from "is-ci";
import { rimraf } from "rimraf";

import Migrate from "../../src/commands/migrate.js";

const testPassVersoPath = path.resolve( "tests/artefacts/verso" );
const testPassRectoPath = path.resolve( "tests/artefacts/recto-copy" );
const originalLog = console.log;

const testPassPostDirectories = [
  "20160209-090107",
  "20160209-124423",
  "114968877794416644"
];

const testPassMediaFileCount = 6;

/**
 * Helper function to tidy the archive directory.
 */
function tidyRectoDir() {
  rimraf.sync(
    testPassRectoPath + "/*",
    {
      preserveRoot: true,
      glob: true
    }
  );
}

/**
 * Mute console logging.
 */
function mute() {
  console.log = () => {};
}

/**
 * Restore the original console log functionality.
 */
function unmute() {
  console.log = originalLog;
}

describe( "Migrate", () => {

  before( () => {
    tidyRectoDir();
    mute();
  } );

  after( () => {
    tidyRectoDir();
    unmute();
  } );

  it( "should copy all posts from verso to recto directory", async( ctx ) => {

    if ( isCI ) {
      ctx.skip( "Skip test on CI" );
      return;
    }

    const command = new Migrate(
      testPassVersoPath,
      testPassRectoPath
    );

    await command.run();

    for ( let postDirectory of testPassPostDirectories ) {
      assert.ok(
        lstatSync(
          path.join(
            testPassRectoPath,
            postDirectory
          )
        )
      );

      assert.ok(
        lstatSync(
          path.join(
            testPassRectoPath,
            postDirectory,
            "index.md"
          )
        )
      );
    }

    let postMedia = await readdir(
      testPassRectoPath,
      { recursive: true }
    );

    postMedia = postMedia.filter( mediaFile => {
      if ( path.extname( mediaFile ) === ".webp" ) {
        return true;
      }
    } );

    assert.equal(
      postMedia.length,
      testPassMediaFileCount
    );

  } );

} );
