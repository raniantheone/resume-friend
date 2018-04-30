import React, { Component } from 'react';

var Remarkable = require("remarkable");
var md = new Remarkable({breaks: true});

function createMarkup(data) {
  return {__html: md.render(data)};
}


class CoverLetter extends Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={createMarkup(this.props.content.letterContent)}></div>
    );
  }
}

function fillComponentWithData(content) {
  return (
    <CoverLetter content={content}></CoverLetter>
  );
}

export {CoverLetter};
export {fillComponentWithData};
export const styleName = "Test 1";
export const styleId = "simpleTraditional";
