import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Dropdown, Grid } from 'semantic-ui-react';


/**
 Utilities
**/

function getDocumentsByType(typeValue) {
  let documentsMap = {
    resume: [
      {value: "resume01", text: "resume 1"},
      {value: "resume02", text: "resume 2"},
    ],
    letter: [
      {value: "letter01", text: "letter 1"},
      {value: "letter02", text: "letter 2"},
    ]
  };
  return documentsMap[typeValue];
}

function getStyleByType(typeValue) {
  let stylesMap = {
    resume: [
      {value: "resumeStyle01", text: "resume style 1"},
      {value: "resumeStyle02", text: "resume style 2"},
    ],
    letter: [
      {value: "letterStyle01", text: "letter style 1"},
      {value: "letterStyle02", text: "letter style 2"},
    ]
  };
  return stylesMap[typeValue];
}


/**
 Initial Data for Components
**/

let initTypeItems = [
  {value: "resume", text: "Resume"},
  {value: "letter", text: "Cover Letter"}
];

let initDocumentItems = getDocumentsByType(initTypeItems[0].value);

let initStyleItems = getStyleByType(initTypeItems[0].value);

let initLocaleItems = [
  {value: "en-US", text: "English"},
  {value: "zh", text: "Chinese"}
];

/**
 Components
**/

const centerStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  width: 790 + "px"
};

class CustomDropDown extends Component {

  /**
   Expects props: items, handlerFunction
   **/

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      selectedValue: this.props.items[0].value,
      handlerFunction: this.props.handlerFunction
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.items !== this.props.items) {
      this.setState({items: nextProps.items, selectedValue: nextProps.items[0].value});
    }
  }
  // Since semantic-ui-react's dropdown only render defaultValue once,
  // use this method to implement default selected effect when the items are changed
  // ref: https://github.com/Semantic-Org/Semantic-UI-React/issues/1149
  updSelVal(e, data) {
    this.setState({selectedValue: data.value});
    this.state.handlerFunction(data);
  }

  render() {
    return (
      <Dropdown selection fluid options={this.state.items} value={this.state.selectedValue} onChange={this.updSelVal.bind(this)}>
      </Dropdown>
    );
  }

}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typeItems: initTypeItems,
      documentItems: initDocumentItems,
      styleItems: initStyleItems,
      localeItems: initLocaleItems
    };

    getDocumentAndStyleByType = getDocumentAndStyleByType.bind(this);
  }

  render() {
    return (
      <div style={centerStyle}>
        <div className="ignorePrint">
          <Grid padded columns='equal'>
            <Grid.Column>
              <CustomDropDown items={this.state.typeItems} handlerFunction={getDocumentAndStyleByType}></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown items={this.state.documentItems} handlerFunction={testHandlerForDocuments}></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown items={this.state.styleItems} handlerFunction={testHandlerForDocuments}></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown items={this.state.localeItems} handlerFunction={testHandlerForDocuments}></CustomDropDown>
            </Grid.Column>
          </Grid>
        </div>
        <div className="overrideBorder"></div>
      </div>
    );
  }

}


/**
 Component Action Handlers
**/

function getDocumentAndStyleByType(data) {
  console.log(data.value);
  this.setState({documentItems: getDocumentsByType(data.value)});
  this.setState({styleItems: getStyleByType(data.value)});
}

function testHandlerForDocuments(data) {
  console.log(data.value);
}


export default App;
