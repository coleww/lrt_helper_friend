(function() {
  function $(selector) {
    return [].slice.call(document.querySelectorAll(selector));
  }

  var selectorsByPlatform = {
    twitter: {
      tweetList: '.content-main',
      tweet: '.tweet',
      tweetText: '.tweet-text',
      retweetedText: '.js-retweet-text .js-user-profile-link',
      permalink: '.permalink'
    },
    tweetdeck: {
      tweetList: '.js-column',
      tweet: '.stream-item',
      tweetText: '.tweet-text',
      retweetedText: '.tweet-context a',
      permalink: '.js-detail-content'
    }
  }

  var platform = window.location.host.split('.')[0];
  var selectors = selectorsByPlatform[platform];

  var regex = /\blrt\b/i;

  // listening to clicks on the tweet steam
  $(selectors.tweetList)[0].addEventListener('click', function (evt) {

    // if we clicked on some tweet text
    if (evt.target.classList.contains(selectors.tweetText.slice(1))) {

      // check if that tweet text contains "LRT"
      if (evt.target.textContent.match(regex)) {

        // TODO: this is twitter specific, we can probably do some magic to search for nearest parent?
        // get the parent tweet element (lol so brittle :<)
        // var tweet = evt.target.parentElement.parentElement.parentElement;

        // tweetdeck specific:
        var tweet = evt.target.parentElement.parentElement.parentElement.parentElement;

        // get the username who tweeted the LRT
        var username = tweet.dataset.screenName;

        // get all of the tweets on the page
        // TODO: for tweetdeck, make it fetch in the current column?
        var tweets = $(selectors.tweet);

        // find the index of the tweet you clicked on within all the tweets
        var tweetIndex = tweets.indexOf(tweet);

        // grab all the tweets that appear after the tweet that was clicked on
        var tweetsToSearch = tweets.slice(tweetIndex + 1);

        // TODO: what to do if the retweet is not scrolled to yet?

        // iterate over those tweets
        tweetsToSearch.some(function (tweetToSearch) {

          // check if the tweet is actually an RT
          var rtText = tweetToSearch.querySelector(selectors.retweetedText)
          if (rtText) {

            // get the username that RT'd the tweet
            var rtUsername = rtText.getAttribute('href').slice(1);
            console.log(rtUsername, username)

            // if the LRT user is the RT'ing user
            if (rtUsername === username) {

              // tweetToSearch is what we want to embed on the page
              console.log('WOW WE FOUND IT');
              var clonedTweet = tweetToSearch.cloneNode(true);

              if (platform === 'twitter') {
                clonedTweet.querySelector('.avatar').style.marginLeft = 0;
                clonedTweet.querySelector('.avatar').style.marginRight = '5px';
              }

              // TODO: twitter specific! maybe? must wait for modal thing to happen?
              // this is probably the same deal on tweetdeck? maybe? lol
              setTimeout(function () {

                document.querySelector(selectors.permalink).appendChild(clonedTweet);
              }, 1000)

              // stop iterating, we found what we want, we are good and happy
              return true;
            }
          }
        })

      }
    }
  })
})();
