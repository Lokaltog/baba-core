Baba
====

:Author: Kim Silkebækken (kim@silkebaekken.net)
:Source: https://github.com/Lokaltog/baba
:Website: http://baba.computer/

**Grammar designer application which exports AMD/CommonJS/browser-compatible text
generators.**

Baba is a modern Javascript-based designer for text generators, inspired by the `Dada
Engine <http://dev.null.org/dadaengine/>`_. It runs in the browser and allows you to
easily design your very own text generator.

Baba exports compressed text generator scripts which can be run in the browser or on
the command line (with node.js).

Tutorial
--------

Where do I begin?
^^^^^^^^^^^^^^^^^

First of all, you need something to parody. Any subject with a lot of jargon or
neologisms works well (e.g. technical subjects or any form of snobbery).

Once you've found a subject to parody you need to collect some sample data which
you'll base the grammar on. In this example we'll use the git man pages, which are
filled with technical jargon and use a certain format, which makes it easy to parody.

Creating a man page generator
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

#. Open any git man page, e.g. ``man git-rebase``.

#. Find a sentence with a lot of jargon and words that can be replaced with
   synonyms. Bonus points if you don't have a clue what the sentence actually means:

       All changes made by commits in the current branch but that are not in
       <upstream> are saved to a temporary area.

#. Mark any words that can be replaced:

       All [noun-s] [verb-ed] by [noun] in the [adjective] [noun] but that are not in
       [noun] are [verb-ed] to a [adjective] [noun].

   You should replace as many words as possible with synonyms, this will make the
   resulting text less repetitive and more believable.

#. Collect synonyms and jargon, for this generator you can list all the git
   executables and collect the verbs from them (add, annotate, apply) to get some
   technical synonyms. Google is also a great source for synonyms (search for "<word>
   synonyms").

   Sort the words by word class and subject, and get ready to add them to the grammar
   designer! Please read the `Grammar designer guide`_ if you're not familiar with
   the designer.

#. Add groups in the designer for the word classes you're going to use. The designer
   has support for highlighting the main word classes (noun, verb, adjective, etc.)
   if they're defined as groups at the root level in the designer.

#. Add word lists with all your collected synonyms to each word class group. You can
   add subgroups to organize your grammar if you have many different subjects or
   categories of words.

#. Add a sentence group for sentences that will be available in the exported
   grammar. Make sure to click the export button to the right of the group
   header.

   Add static strings and placeholders and transform the words to match the sentences
   you've collected. The designer includes features for transforming verbs into
   different tenses, pluralizing nouns, etc., which will be included in the exported
   generator. Use the preview functionality to verify that you've added the correct
   words and transforms. Note that you can add transforms and change word references
   in the preview view as well.

#. At step 3 in the designer you can preview all the exported sentences in the
   grammar. These sentences will be available as functions in the exported grammar
   object.

#. Congratulations, you've just created a text generator!

   Hit the export button to get the final JS source code. The JS code can be used as
   a CommonJS or AMD module, or directly in the browser via the ``window.Baba``
   object.

Grammar designer guide
----------------------

TODO
