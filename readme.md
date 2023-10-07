# Backtick conlang
Just a small conlang for a project with a few friends.

# Usage
You can browse the site [here](https://atrufulgium.github.io/backtickconlang). There's a built-in dictionary and you can toggle the readings.

When modifying pages, please consider [github pages' limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). In particular, there are two relevant major points:
* **Do not upload any large assets**, and if necessary, resort to hacks. For instance, most images are svg, and the few background pngs are heavily blurred, so they do not need to be large.
* **Do not make too many changes too quickly**. The docs state "a soft limit of 10 builds per hour". Changing single pages through the github interface, but if you are going to change many (for instance when creating a bazillion pages), do it in a single PR.

## Creating new pages
The workflow for creating new pages is as follows:
* First, create (or copy) a markdown file, e.g. `X.md`, in [`/_grammar/`](./_grammar/). Ensure the first two lines are `---` and `---`. Below that is free space to write whatever you want later.
* Next, navigate to [`./_data/grammar_chapters.yml`](./_data/grammar_chapters.yml), and add your file at the appropriate place. The `name` value is a human-readable description of `X`, while the `link` value must be `/grammar/X.html`.
* If you need to add chapters, follow the existing format. While `chapter_name` is self-explanatory, `header` is not. Chapters have two types of header (horizontal, vertical), which are small pngs (that are blurred later). As such, with `header: Y.png`, you have to add two files `./resources/Y.png` and `./resources/vertical_Y.png`.

## Editing existing pages
If you want to modify some page `atrufulgium.github.io/backtickconlang/X`, you can do that in the repo by going to `./grammar/X.md` in the repo.

Stuff is written in markdown, but with a few modifications.
* The biggest thing is the conlang. You can write `=[sàia]=` which will then appear in the conscript.
* The conscript has a thing where word starts and ends are marked. If you do not want this, you can use a `-` at the start/end to remove this. For instance, `=[-sàia]=` does not have the start marker.
* If you want to change the order in which vowels are collapsed, you can manually mark where this is also with `-`. For instance, `=[sà-ia]=` and `=[sài-a]=` render differently. You should nearly never have to deal with this.
* You can enclose text with `[aside][/aside]` tags to make it appear on the side.
* You can enclose a table with a lesson's vocabulary with `[vocab][/vocab]` tags at the start of a page.
* You can enclose text with `[todo][/todo]` tags to make it obnoxiously visible.
* With the above tags, make sure to leave a full blank row of space between anything table-y and the tags. They don't interact that nicely.
* As opposed to github pages, you can fully use any html that you want. Note that any markdown inside html tags is not processed.
* You can link to a grammar page `X.md` by writing `[some text](/grammar/X)`. No need to care about the `.html` or the fact that this entire site lives inside a `/backtickconlang/`.

# License
This is part of a larger project. All code (`.js`, `.html`, `.css`) is MIT-licensed. All content (`.png`, `.svg`, `.ttf`, `.md`, `.yml`, and any other file types not mentioned) are, for the time being, a lame "copyright, all rights reserved". (Planning on CC0'ing when the larger project this is part of is actually finished though.)
