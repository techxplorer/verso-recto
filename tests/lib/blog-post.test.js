import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";

import TomlMatter from "../../src/lib/toml-matter.js";

import BlogPost from "../../src/lib/blog-post.js";

const testFailPathOne = "";
const testFailPathMsgOne = "Path not found";
const testFailPathTwo = path.resolve( import.meta.dirname, "../../package.json" );
const testFailPathMsgTwo = "Path must be a directory";
const testFailPathThree = path.resolve( "tests/artefacts/verso" );
const testFailPathMsgThree = "Directory must contain an 'index.md' file";
const testFailPathFour = path.resolve( "tests/artefacts/invalid-post" );
const testPassPathOne = path.resolve( "tests/artefacts/verso/20160209-090107" );
const testPassPathTwo = path.resolve( "tests/artefacts/verso/20160209-124423" );
const testPassPathThree = path.resolve( "tests/artefacts/verso/114968877794416644" );
const testPassSourceFrontMatter = [
  "title",
  "date",
  "categories",
  "tags"
];
const testPassNewFrontMatter = [
  "title",
  "date",
  "taxonomies",
  "extra"
];
const testMediaCountOne = 1;
const testMediaCountTwo = 1;
const testMediaCountThree = 4;

describe( "BlogPost", () => {

  describe( "Constructor", () => {

    it( "should throw a TypeError when the path cannot be found", () => {
      assert.throws(
        () => {
          new BlogPost(
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
          new BlogPost(
            testFailPathTwo
          );
        },
        {
          name: "TypeError",
          message: testFailPathMsgTwo
        }
      );
    } );

    it( "should throw a TypeError when the path doesn't contain a index.md file", () => {
      assert.throws(
        () => {
          new BlogPost(
            testFailPathThree
          );
        },
        {
          name: "TypeError",
          message: testFailPathMsgThree
        }
      );
    } );

    it( "should not throw an error when the parameters are valid", () => {
      assert.doesNotThrow(
        () => {
          new BlogPost(
            testPassPathOne
          );
        }
      );
    } );

  } );

  describe( "loadPost", async() => {

    it( "should not throw an error for YAML frontmatter", async() => {
      const blogPost = new BlogPost( testPassPathOne );

      try {
        await blogPost.loadPost();
      } catch ( error ) {
        assert.fail( `Unexpected error was thrown: ${ error.message }` );
      }

    } );

    it( "should not throw an error for TOML frontmatter", async() => {
      const blogPost = new BlogPost( testPassPathTwo );

      try {
        await blogPost.loadPost();
      } catch ( error ) {
        assert.fail( `Unexpected error was thrown: ${ error.message }` );
      }

    } );

    it( "should throw an error for invalid frontmatter", async() => {
      const blogPost = new BlogPost( testFailPathFour );

      try {
        await blogPost.loadPost();
      // eslint-disable-next-line no-unused-vars
      } catch ( error ) {
        return;
      }

      assert.fail( "Expected exception was not thrown" );

    } );

    it( "should result in an object with the expected properties", async() => {

      let blogPost = new BlogPost( testPassPathOne );
      await blogPost.loadPost();
      assert.ok(
        "data" in blogPost.postContent,
        "Property 'data' does not exist"
      );
      assert.ok(
        "content" in blogPost.postContent,
        "Property 'content' does not exist"
      );

      blogPost = new BlogPost( testPassPathTwo );
      await blogPost.loadPost();
      assert.ok(
        "data" in blogPost.postContent,
        "Property 'data' does not exist"
      );
      assert.ok(
        "content" in blogPost.postContent,
        "Property 'content' does not exist"
      );

    } );

    it( "should result in correct frontmatter", async() => {

      let blogPost = new BlogPost( testPassPathOne );
      await blogPost.loadPost();

      for ( let item of testPassSourceFrontMatter ) {
        assert.ok(
          item in blogPost.postContent.data,
          `Item ${ item } is not in the front matter`
        );
      }

      blogPost = new BlogPost( testPassPathTwo );
      await blogPost.loadPost();

      for ( let item of testPassSourceFrontMatter ) {
        assert.ok(
          item in blogPost.postContent.data,
          `Item ${ item } is not in the front matter`
        );
      }

      blogPost = new BlogPost( testPassPathThree );
      await blogPost.loadPost();

      testPassSourceFrontMatter.push(
        "toot_url"
      );

      for ( let item of testPassSourceFrontMatter ) {
        assert.ok(
          item in blogPost.postContent.data,
          `Item ${ item } is not in the front matter`
        );
      }

    } );

    it( "should load the correct number of media files", async() => {

      let blogPost = new BlogPost( testPassPathOne );
      await blogPost.loadPost();

      assert.ok(
        blogPost.postMedia.length,
        testMediaCountOne
      );

      blogPost = new BlogPost( testPassPathTwo );
      await blogPost.loadPost();

      assert.ok(
        blogPost.postMedia.length,
        testMediaCountTwo
      );

      blogPost = new BlogPost( testPassPathThree );
      await blogPost.loadPost();

      assert.ok(
        blogPost.postMedia.length,
        testMediaCountThree
      );

    } );

  } );

  describe( "convertPost", async() => {

    it( "should create valid new front matter", async() => {

      const blogPost = new BlogPost( testPassPathOne );
      await blogPost.loadPost();
      blogPost.convertPost();

      assert.ok(
        TomlMatter.validate(
          TomlMatter.serialize(
            blogPost.newPostContent.data,
            blogPost.newPostContent.content
          )
        )
      );

      for ( let item of testPassNewFrontMatter ) {
        assert.ok(
          item in blogPost.newPostContent.data,
          `Item ${ item } is not in the new front matter`
        );
      }

    } );

  } );

} );
