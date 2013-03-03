# Web Action Hero Toolbelt

A cross-browser extension which does two things:

1. Replaces social sharing buttons with &lt;action&gt; elements
1. Activates &lt;action&gt; elements

Watch a [demo video](https://www.youtube.com/watch?v=9OAfvuKCsEk).

## Installation

The Toolbelt is cross-browser (courtesy of [Kango](http://kangoextensions.com)) and can be installed on Safari, Firefox, Chrome or Opera.

1. Clone the repo (downloads offered soon)
1. Navigate to /output

Then, depending on your browser:

* Chrome:
	1. Navigate to chrome://extensions
	1. If not already enabled, enable Dev Mode (top right)
	1. Load Unpacked Extension, and select /output/chrome
	1. Web Actions should pop up in the list, Click 'Options' to configure it.
* Safari:
	1. Develop -> Show Extension Builder
	1. Click + (bottom left)
	1. Add Extension
	1. Select /output/safari/webactions.safariextension
* Firefox:
	1. Tools -> Addons
	1. Extensions
	1. Little cog in the top right -> Install Add-on From File
	1. Select /output/webactions_0.9.xpi
	1. Trust it
	1. Restart it
	1. Configure it

## Set Up

Click the button in your toolbar to bring up the config UI. An explanation is within.

TODO: Write up a more comprehensive guide/do video

## Questions with answers

### Wait, what are &lt;action&gt; elements?

An experimental bit of markup (proposed by Tantek Çelik [here](http://tantek.com/presentations/2012/06/osb12-web-actions/#slide15)) for implementing the Web Action pattern in a way back-compatible with existing markup patterns.

For example, say you’re a blogger and you want people to be able to share your content. You might decide to put some social sharing buttons at the bottom of your articles:

```html
<article class="h-entry">
	<h1 class="p-name">My Awesome Blog Post</h1>
	
	<div class="e-content">•••</div>
	
	<footer>
		<p>Share this post: <a href="•••">Tweet Button</a>
	</footer>
</article>
```

But what if people aren’t using twitter? Surely I should add a load of others (facebook, google plus, linkedin, reddit, etc.) — and all of a sudden you’re a [button slut](http://www.flatfrogblog.com/2011/08/07/web-actions/):

```html
<footer>
	<a href="•••">Tweet Button</a>
	<a href="•••">+1 Button</a>
	<a href="•••">Like Button</a>
</footer>
```

But if I take all of these buttons away in favour of some experimental technology no-one uses, there won’t really be any benefit. So, the `action` element is back-compatible with current markup. Just wrap all buttons which represent a particular verb in that `action`:

```html
<footer>
	<action do="post" with="http://example.com/this/page">
		<a href="•••">Tweet Button</a>
		<a href="•••">+1 Button</a>
		<a href="•••">Like Button</a>
	</action>
</footer>
```

Non-supporting agents will show the buttons, supporting agents will replace them with a UI tailored to the user.

### Isn’t this just [web intents | web activities | x other technology]?

No. Web Actions are a user-centric reframing of dev-centric web intents, the &lt;action&gt; element is a simple, experimental implementation designed so we can start using this pattern straight away. Only through real world usage will we discover the best solution to these problems.

Other similar technologies also require significant effort on the producer side (writing the UI, invoking via JavaScript) whereas web actions only require a single extra element per action, which can be wrapped around existing markup.

## Questions without answers (yet)

### Most people don’t understand URL APIs — why doesn’t this autodiscover services like web intents?

Because that’s complicated. It would require services to explicitly declare what verbs (which we haven’t agreed on yet) they can handle, and lots and lots of UI programming to be done.

This is *not* an end product, it is a prototype made so interested parties can get stuck in using this markup now and understanding these patterns now. We’ll handle making it super easy to use later, if it’s well-received.

### What verbs should I use?

There’s currently no common registry of verbs. We’re researching them and documenting them [here](http://indiewebcamp.com/webactions#Brainstorming). Hop on #indiewebcamp on freenode and ask about it.
