import React, { Component } from 'react'
import { Alert, Input, Card, CardTitle, CardText } from 'reactstrap'

import './App.css'

// Url to fetch the emoji list (at the moment v.11.0.1)
const emojiDataUrl = 'https://unpkg.com/emoji.json@11.0.1/emoji.json'


class App extends Component {
  constructor() {
    super()
    this.state = {
      emojiList: [], // All the emoji
      activeEmoji: [], // The active emoji
      lastCopied: '', // The emoji that has just been copied on the clipboard
      visible: false, // Wheter to show or not the alert message
    }

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  // Fetch the emoji list and set the state accordingly
  componentDidMount() {
    fetch(emojiDataUrl)
      .then(response => response.json())
      .then(data => {
        this.setState({ ...this.state, emojiList: data, activeEmoji: data })
      });
  }

  render() {
    let content;
    // Do we have loaded the emoji yet?
    if (this.state.emojiList.length === 0)
      content = <div className="message">Loading emoji ⌛</div>
    // No emoji matches our query string?
    else if (this.state.activeEmoji.length === 0)
      content = <div className="message">No emoji found 😢</div>
    // We are good to go, let's show the active emoji
    else content = <div className="deck">
      {this.state.activeEmoji.map(emoji => (
        <Card key={emoji.name}>
          <CardTitle onClick={() => this.handleCopyToClipboard(emoji.char)}>{emoji.char}</CardTitle>
          <CardText>
            {/* <code onClick={() => this.handleCopyToClipboard(emoji.codepoints)}>{emoji.codepoints}</code><br /> */}
            <code onClick={() => this.handleCopyToClipboard(emoji.codes)}>{emoji.codes}</code>
          </CardText>
        </Card>))}
    </div>

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
            onChange={this.handleSearchInputChange} />
        </header>

        {/* Display the page content */}
        {content}

        {/* Tell the user we have succesfully copied the emoji */}
        <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
          Copied <b>{this.state.lastCopied}</b> to the clipboard!
        </Alert>

      </div>
    )
  }

  // Hide the alert bar
  onDismiss() {
    this.setState({ ...this.state, visible: false });
  }

  // When the user imputs something in the search bar look for the matching emoji
  handleSearchInputChange(event) {
    let text = event.target.value
    let results;

    // If the user has typed something more than just a letter look for it else just show all the emoji
    if (text.length > 1) {
      results = this.state.emojiList.filter(emoji => (
        emoji.keywords.includes(text.toLowerCase()) ||
        emoji.name.includes(text.toLowerCase()) ||
        emoji.char.includes(text.toLowerCase())
      ))
    } else
      results = this.state.emojiList

    // Add the results to the state
    this.setState({
      ...this.state,
      activeEmoji: results,
    })
  }

  // Copy the str to the user clipboard
  handleCopyToClipboard(str) {
    // To copy the value create a temporary DOM element anc copy its content
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this.setState({
      ...this.state,
      lastCopied: str,
      visible: true,
    })

    // Hide the alert after a timeout
    let self = this
    setTimeout(() =>
      self.setState({
        ...this.state,
        visible: false,
      }), 2000);
  }
}

export default App
