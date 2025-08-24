# Verso Recto #

A tool to migrate my website content written in [Markdown][md] format, from one
[static site generator][ssg] (SSG) to another.

Specifically, migrating my content from [Hugo][hugo] to [Zola][zola].

It is designed to:

1. Migrate content from one content directory to another.
1. Update the front matter of each post.

    1. Convert the format of the front matter to [TOML][toml].
    1. Add an extra option required for the theme I'm using.

1. Add a short code to the post content to use the co-located photos
1. Convert co-located photos from the [JPEG format][jpeg] to the more efficient [WebP format][webp].

## 📖 Verso to Recto ##

I named the tool after 'verso' the *left side of the page* and 'recto' the *right side of the page*.

- Verso - the source directory, the left side of the migration.
- Recto - the destination directory, the right side of the migration.

## ✴️ Important note ##

The results of the migration are likely not to be exactly what you need. The tool
works for me and my plans to migrate my website. I've put the code here as an
example of an approach to content migration.

## 🛠️ Use the tool ##

To use the tool you need to download the source code.

Install the dependencies:

```shell
npm install
```

Install the [cwebp tool][cwebp], on my system I use [homebrew][brew]:

```shell
brew install webp
```

Link the tool into your path

```shell
npm link
```

Invoke the tool with the two required parameters

```shell
verso-recto <verso-path> <recto-path>
```

## 🙏 Gratitude ##

My thanks to everyone who has contributed to all the projects that made
this possible. 🙏😊💖

[brew]: https://brew.sh
[cwebp]: https://developers.google.com/speed/webp/docs/cwebp
[hugo]: https://gohugo.io
[jpeg]: https://en.wikipedia.org/wiki/JPEG
[md]: https://en.wikipedia.org/wiki/Markdown
[ssg]: https://en.wikipedia.org/wiki/Static_site_generator
[toml]: https://en.wikipedia.org/wiki/TOML
[webp]: https://en.wikipedia.org/wiki/WebP
[zola]: https://www.getzola.org
