import React, { Component } from "react";
import "./App.css";
import { Dropdown, Grid } from "semantic-ui-react";
import * as resumeStyles from "./skins/resume";
import * as letterStyles from "./skins/coverLetter";
import {config} from "./config/config_development";

var contentful = require("contentful");
var client = contentful.createClient({
  space: config.contentful.space,
  environment: config.contentful.environment,
  accessToken: config.contentful.accessToken
});

/**
 Utilities
**/

// Access Content Delivery API (CDA)
// Ref: https://www.contentful.com/developers/docs/references/content-delivery-api/
async function invokeCDA(queryObj) {
  let data = null;
  try {
    data = await client.getEntries(queryObj);
  } catch(error) {
    console.log(error);
  }
  return data;
}

async function getAvailableResumes() {
  let resumes = await invokeCDA({content_type: "resume"});
  console.log(resumes.items);
  return resumes.items;
}

async function getAvailableCoverLetters() {
  let coverLetters = await invokeCDA({content_type: "coverLetter"});
  console.log(coverLetters.items);
  return coverLetters.items;
}

async function getResumeDataById(id, locale) {
  let resumeData = await invokeCDA({
    include: 1,
    content_type: "entries",
    "sys.id": id,
    locale: locale
  });
  console.log(resumeData.includes.Entry);
  return resumeData.includes.Entry;
}

async function getCoverLetterDataById(id, locale) {
  let letterData = await invokeCDA({
    content_type: "coverLetter",
    "sys.id": id,
    locale: locale
  });
  console.log(letterData.items[0].fields);

  let result = letterData.items[0].fields;
  let [contact] = letterData.includes.Entry.filter((entry) => {
    return entry.sys.contentType.sys.id === "contact";
  });
  if(contact) {
    result.contact = contact;
  }

  return result;
}

async function getDocumentsByType(typeValue) {

  let resumes = await getAvailableResumes();
  resumes = resumes.map((resumeItem) => {
    return {
      value: resumeItem.fields.linkedEntries.sys.id,
      text: resumeItem.fields.resumeName
    };
  });

  let letters = await getAvailableCoverLetters();
  letters = letters.map((letterItem) => {
    return {
      value: letterItem.sys.id,
      text: letterItem.fields.companyName
    }
  });

  let documentsMap = {
    resume: resumes,
    letter: letters
  };
  return documentsMap[typeValue];

}

function getStyleByType(typeValue) {
  let stylesMap = {
    resume: Object.keys(resumeStyles).map((propKey, i) => {
        return {
          value: propKey,
          text: resumeStyles[propKey].styleName
        }
      }),
    letter: Object.keys(letterStyles).map((propKey, i) => {
        return {
          value: propKey,
          text: letterStyles[propKey].styleName
        }
      })
  };
  return stylesMap[typeValue];
}


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
   Expects props: items, customHandler
   **/

  changeHandler(e, data) {
    let currentSelectedItem = this.props.items.filter((item) => { return item.value === data.value })[0];
    let mappedParentPartialState = this.props.selectedItem;
    this.props.customHandler(currentSelectedItem, mappedParentPartialState);
  }

  render() {
    return (
      <Dropdown selection fluid
        options={this.props.items}
        value={this.props.selectedItem[Object.keys(this.props.selectedItem)[0]] === null ? "" : this.props.selectedItem[Object.keys(this.props.selectedItem)[0]].value}
        onChange={this.changeHandler.bind(this)}
      ></Dropdown>
    );
  }

}

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      typeItems: [],
      currentType: null,
      documentItems: [],
      currentDocument: null,
      styleItems: [],
      currentStyle: null,
      localeItems: [],
      currentLocale: null,
      currentRenderer: null,
      currentContent: null
    };

    this.typeChangeHandler = this.typeChangeHandler.bind(this);
    this.documentChangeHandler = this.documentChangeHandler.bind(this);
    this.styleChangeHandler = this.styleChangeHandler.bind(this);
    this.localeChangeHandler = this.localeChangeHandler.bind(this);

    this.updSelectedItem = this.updSelectedItem.bind(this);
    this.updDocumentAndStyleByType = this.updDocumentAndStyleByType.bind(this);

  }

  async componentDidMount() {

    let initTypeItems = [
      {value: "resume", text: "Resume"},
      {value: "letter", text: "Cover Letter"}
    ];
    let initStyleItems = getStyleByType(initTypeItems[0].value);
    let initLocaleItems = [
      {value: "en-US", text: "English"},
      {value: "zh", text: "Chinese"}
    ];
    let initDocumentItems = await getDocumentsByType(initTypeItems[0].value);
    let newRenderer = this.getNewRenderer(initTypeItems[0].value, initStyleItems[0].value);
    let newContent = await this.getNewContent(initTypeItems[0].value, initDocumentItems[0].value, initLocaleItems[0].value);

    this.setState({
      typeItems: initTypeItems,
      currentType: initTypeItems[0],
      documentItems: initDocumentItems,
      currentDocument: initDocumentItems[0],
      styleItems: initStyleItems,
      currentStyle: initStyleItems[0],
      localeItems: initLocaleItems,
      currentLocale: initLocaleItems[0],
      currentRenderer: newRenderer,
      currentContent: newContent
    });

  }

  async typeChangeHandler(currentSelectedItem, mappedParentPartialState) {
    // get newly selected type
    mappedParentPartialState[Object.keys(mappedParentPartialState)[0]] = currentSelectedItem;

    // get new documents, new styles, and default selected items for both
    let selectedTypeItem = currentSelectedItem;
    let newDocumentItems = await getDocumentsByType(selectedTypeItem.value);
    let newStyleItems = getStyleByType(selectedTypeItem.value);
    let newRenderer = this.getNewRenderer(selectedTypeItem.value, newStyleItems[0].value);
    let newContent = await this.getNewContent(selectedTypeItem.value, newDocumentItems[0].value, this.state.currentLocale.value);

    let stateToBe = {
      currentType: selectedTypeItem,
      documentItems: newDocumentItems,
      currentDocument: newDocumentItems[0],
      styleItems: newStyleItems,
      currentStyle: newStyleItems[0],
      currentRenderer: newRenderer,
      currentContent: newContent
    };
    stateToBe = Object.assign(mappedParentPartialState, stateToBe);
    console.log(stateToBe);
    this.setState(stateToBe);

  }

  async documentChangeHandler(currentSelectedItem, mappedParentPartialState) {
    // get newly selected document
    mappedParentPartialState[Object.keys(mappedParentPartialState)[0]] = currentSelectedItem;
    let newContent = await this.getNewContent(this.state.currentType.value, currentSelectedItem.value, this.state.currentLocale.value);

    let stateToBe = {
      currentContent: newContent
    };
    stateToBe = Object.assign(mappedParentPartialState, stateToBe);
    console.log(stateToBe);
    this.setState(stateToBe);

  }

  async styleChangeHandler(currentSelectedItem, mappedParentPartialState) {
    // get newly selected document
    mappedParentPartialState[Object.keys(mappedParentPartialState)[0]] = currentSelectedItem;
    let newRenderer = this.getNewRenderer(this.state.currentType.value, currentSelectedItem.value);

    let stateToBe = {
      currentRenderer: newRenderer
    };
    stateToBe = Object.assign(mappedParentPartialState, stateToBe);
    console.log(stateToBe);
    this.setState(stateToBe);

  }

  async localeChangeHandler(currentSelectedItem, mappedParentPartialState) {
    // get newly selected document
    mappedParentPartialState[Object.keys(mappedParentPartialState)[0]] = currentSelectedItem;
    let newContent = await this.getNewContent(this.state.currentType.value, this.state.currentDocument.value, currentSelectedItem.value);

    let stateToBe = {
      currentContent: newContent
    };
    stateToBe = Object.assign(mappedParentPartialState, stateToBe);
    console.log(stateToBe);
    this.setState(stateToBe);

  }

  updSelectedItem(currentSelectedItem, mappedParentPartialState) {

    console.log("1 start ... updSelectedItem");
    console.log(this.state);

    mappedParentPartialState[Object.keys(mappedParentPartialState)[0]] = currentSelectedItem;
    // this.setState(mappedParentPartialState);
    this.setState((prevState, props) => ({
      mappedParentPartialState
    }));
    console.log("1 end ... updSelectedItem");
    console.log(this.state);
  }

  async updDocumentAndStyleByType(selectedType) {

    console.log("2 start ... updDocumentAndStyleByType");
    console.log(this.state);

    getDocumentsByType(selectedType.value).then((documents) => {

      let newDocumentItems = documents;
      let newStyleItems = getStyleByType(selectedType.value);

      this.setState((prevState, props) => ({
        documentItems: newDocumentItems,
        currentDocument: newDocumentItems[0],
        styleItems: newStyleItems,
        currentStyle: newStyleItems[0]
      }));

      console.log("2 end");
      console.log(this.state);

    }).catch((error) => {
      console.log(error);
    });

  }

  getNewRenderer(typeValue, styleValue) {
    let renderer = typeValue === "resume" ? resumeStyles[styleValue].fillComponentWithData : letterStyles[styleValue].fillComponentWithData;
    return renderer;
  }

  async getNewContent(typeValue, documentValue, localeValue) {
    let fetcher = typeValue === "resume" ? getResumeDataById : getCoverLetterDataById;
    let content = null;
    try {
      content = await fetcher(documentValue, localeValue);
    } catch(error) {
      console.log(error);
    }
    return content;
  }

  renderDynamicComponent() {
    console.log("rendering content");
    let renderFunction = () => (<div>Loading</div>);
    if(typeof this.state.currentRenderer === "function") {
      renderFunction = this.state.currentRenderer;
    }
    return renderFunction(this.state.currentContent);
  }

  render() {

    console.log("render invoked");

    return (
      <div style={centerStyle}>
        <div className="ignorePrint">
          <Grid padded columns="equal">
            <Grid.Column>
              <CustomDropDown
                items={this.state.typeItems}
                selectedItem={(({currentType}) => {return {currentType}})(this.state)}
                customHandler={this.typeChangeHandler}
              ></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown
                items={this.state.documentItems}
                selectedItem={(({currentDocument}) => {return {currentDocument}})(this.state)}
                customHandler={this.documentChangeHandler}
              ></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown
                items={this.state.styleItems}
                selectedItem={(({currentStyle}) => {return {currentStyle}})(this.state)}
                customHandler={this.styleChangeHandler}
              ></CustomDropDown>
            </Grid.Column>
            <Grid.Column>
              <CustomDropDown
                items={this.state.localeItems}
                selectedItem={(({currentLocale}) => {return {currentLocale}})(this.state)}
                customHandler={this.localeChangeHandler}
            ></CustomDropDown>
            </Grid.Column>
          </Grid>
        </div>
        <div className="overrideBorder">
          {this.renderDynamicComponent()}
        </div>
      </div>
    );

  }

}


export default App;
