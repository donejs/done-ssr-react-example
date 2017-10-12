import React, { Component } from 'react';
import ndjsonStream from 'can-ndjson-stream';

export default class extends Component {
  constructor() {
    super();
    this.state = { items: [] };

    fetch('/api/items').then(resp => {
      return ndjsonStream(resp.body);
    }).then(stream => {
      let reader = stream.getReader();

      let read = result => {
        if (result.done) return;
        this.setState({
          items: this.state.items.concat(result.value)
        });
        return reader.read().then(read);
      }

      return reader.read().then(read);
    });
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    let { items } = this.state;

    return (
      <section>
        <h2>List of stuff</h2>
        <ul>
          {items.map(item => (
            <li key={item.item}>
              {item.item}
            </li>
          ))}
        </ul>
      </section>

    );
  }
}
