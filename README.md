# kepora-careers

`board.js` is the careers board that runs on
[kepora.com/job-listings](https://www.kepora.com/job-listings). The Wix page
holds only a two-line loader:

```html
<div id="kepora-jobs-root"></div>
<script src="https://jaredlaney.github.io/kepora-careers/board.js"></script>
```

The board reads live openings from Ashby's public job board API on every page
load, so job changes never need a deploy. This repo is public only because
GitHub Pages needs it to be; it contains no credentials and no candidate data.

**The source of truth is `site/board.js` in the private `kepora-recruiting`
repo.** Edit it there and run `make deploy-board`, which publishes the file
here. `index.html` previews the board at
<https://jaredlaney.github.io/kepora-careers/>.
