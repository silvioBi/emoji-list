import React, { useState, useEffect } from "react";
import { Alert, Input, Card, CardTitle, CardText } from "reactstrap";

import "./App.css";

// Url to fetch the emoji list (at the moment v.11.0.1)
const emojiDataUrl = "https://unpkg.com/emoji.json@11.0.1/emoji.json";

function App() {
  const [emojiList, setEmojiList] = useState([]);
  const [activeEmoji, setActiveEmoji] = useState([]);
  const [copied, setCopied] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch(emojiDataUrl)
      .then(response => response.json())
      .then(data => {
        setEmojiList(data);
        setActiveEmoji(data);
      });
  }, []);

  // Hide the alert bar
  const onDismiss = () => setVisible(false);

  // When the user imputs something in the search bar look for the matching emoji
  const handleSearchInputChange = event => {
    let text = event.target.value;
    let results;

    // If the user has typed something more than just a letter look for it else just show all the emoji
    if (text.length > 1)
      results = emojiList.filter(emoji =>
        emoji.keywords.includes(text.toLowerCase())
      );
    else results = emojiList;

    // Add the results to the state
    setActiveEmoji(results);
  };

  // Copy the str to the user clipboard
  const handleCopyToClipboard = str => {
    // To copy the value create a temporary DOM element anc copy its content
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    setCopied(str);
    setVisible(true);

    // Hide the alert after a timeout
    setTimeout(() => setVisible(false), 2000);
  };

  let content;
  // Do we have loaded the emoji yet?
  if (emojiList.length === 0)
    content = <div className="message">Loading emoji ⌛</div>;
  // No emoji matches our query string?
  else if (activeEmoji.length === 0)
    content = <div className="message">No emoji found 😢</div>;
  // We are good to go, let's show the active emoji
  else
    content = (
      <div className="deck">
        {activeEmoji.map(emoji => (
          <Card key={emoji.name}>
            <CardTitle onClick={() => handleCopyToClipboard(emoji.char)}>
              {emoji.char}
            </CardTitle>
            <CardText>
              {/* <code onClick={() => this.handleCopyToClipboard(emoji.codepoints)}>{emoji.codepoints}</code><br /> */}
              <code onClick={() => handleCopyToClipboard(emoji.codes)}>
                {emoji.codes}
              </code>
            </CardText>
          </Card>
        ))}
      </div>
    );

  // Return the searchbar plus the correct content
  return (
    <div className="emoji-list-app">
      {/* Out search bar */}
      <header className="search-field-wrapper">
        <Input
          autoFocus={true}
          type="text"
          name="search-icon"
          id="searchIcon"
          placeholder="Look for an emoji"
          bsSize="lg"
          onChange={handleSearchInputChange}
        />
      </header>

      {/* Display the page content */}
      {content}

      {/* Tell the user we have succesfully copied the emoji */}
      <Alert color="info" isOpen={visible} toggle={onDismiss}>
        Copied <b>{copied}</b> to the clipboard!
      </Alert>
    </div>
  );
}

export default App;
