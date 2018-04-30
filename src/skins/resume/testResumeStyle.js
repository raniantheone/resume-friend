import React, { Component } from 'react';

class Resume extends Component {
  render() {
    return (
      <div>Test Resume Style Loaded</div>
    );
  }
}

function fillComponentWithData(content) {
  return (
    <Resume content={content}></Resume>
  );
}

export {Resume};
export {fillComponentWithData};
export const styleName = "Test";
export const styleId = "testResumeStyle";
