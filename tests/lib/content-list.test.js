import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";

import ContentList from "../../src/lib/content-list.js";

const testFailPathOne = "";
const testFailPathMsgOne = "Path not found";
const testFailPathTwo = path.resolve( import.meta.dirname, "../../package.json" );
const testFailPathMsgTwo = "Path must be a directory";
const testPassPathOne = path.resolve( "tests/artefacts/verso" );
const testPassPathTwo = path.resolve( "tests/artefacts/recto" );
const testPassContentListSize = 3;

describe( "ContentList", () => {

  describe( "Constructor", () => {

    it( "should throw a TypeError when the path cannot be found", () => {
      assert.throws(
        () => {
          new ContentList(
            testFailPathOne
          );
        },
        {
          name: "TypeError",
          message: testFailPathMsgOne
        }
      );
    } );

    it( "should throw a TypeError when the path is not a directory", () => {
      assert.throws(
        () => {
          new ContentList(
            testFailPathTwo
          );
        },
        {
          name: "TypeError",
          message: testFailPathMsgTwo
        }
      );
    } );

    it( "should not throw an error when the parameters are valid", () => {
      assert.doesNotThrow(
        () => {
          new ContentList(
            testPassPathOne
          );
        }
      );
    } );

  } );

  describe( "loadContents", async() => {

    it( "should load the number of expected content items", async() => {

      const contentList = new ContentList( testPassPathOne );

      let contentListSize = await contentList.loadContents();

      assert.equal(
        contentListSize,
        testPassContentListSize
      );

      // Test the use of the cache, as evidenced by coverage report.
      contentListSize = await contentList.loadContents();

      assert.equal(
        contentListSize,
        testPassContentListSize
      );
    } );

  } );

  describe( "getContentsCount", async() => {

    it( "should return zero for an empty directory", async() => {

      const contentList = new ContentList( testPassPathTwo );

      const count = await contentList.getContentsCount();

      assert.equal(
        count,
        0
      );

    } );

    it( "should return the number of expected content items", async() => {

      const contentList = new ContentList( testPassPathOne );

      const contentListSize = await contentList.loadContents();

      assert.equal(
        contentListSize,
        testPassContentListSize
      );

    } );

  } );

  describe( "getContents", async() => {

    it( "should return an empty array for an empty directory", async() => {

      const contentList = new ContentList( testPassPathTwo );

      const contents = await contentList.getContents();

      assert.ok(
        Array.isArray( contents )
      );

      assert.equal(
        contents.length,
        0
      );

    } );

    it( "should return an array with the expected number of elements", async() => {

      const contentList = new ContentList( testPassPathOne );

      let contents = await contentList.getContents();

      assert.ok(
        Array.isArray( contents )
      );

      assert.equal(
        contents.length,
        testPassContentListSize
      );

      contents = await contentList.getContents();

      assert.ok(
        Array.isArray( contents )
      );

      assert.equal(
        contents.length,
        testPassContentListSize
      );

    } );

  } );

} );
