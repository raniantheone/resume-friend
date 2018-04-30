import React, { Component } from 'react';
import {Card, Grid, Icon, Item, Label, Segment} from 'semantic-ui-react'

var Remarkable = require("remarkable");
var md = new Remarkable({breaks: true});

function createMarkup(data) {
  return {__html: md.render(data)};
}

class Resume extends Component {

  builderDictionary = {
    "Contact": {
      builder: this.buildContact,
      contentType: "contact"
    },
    "WorkExperience": {
      builder: this.buildWorkExp,
      contentType: "workExperience"
    },
    "SideProject": {
      builder: this.buildSideProj,
      contentType: "sideProjects"
    },
    "Skills": {
      builder: this.buildSkills,
      contentType: "skill"
    },
    "Education": {
      builder: this.buildEdu,
      contentType: "education"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      resumeDefinition: [
        {
          sectionId: "Contact",
          sectionName: ""
        },
        {
          sectionId: "WorkExperience",
          sectionName: "Work Experience"
        },
        {
          sectionId: "SideProject",
          sectionName: "Side Project"
        },
        {
          sectionId: "Skills",
          sectionName: "Skills"
        },
        {
          sectionId: "Education",
          sectionName: "Education"
        }
      ]
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.content !== this.state.content) {
      this.setState({content: nextProps.content});
    }
  }

  /**
  Workflow...when looping definitions from Resume state
  1. Get a section definition from Resume state
  2. Get the matching builder function and type identifier for data
  3. Get desired data from filter by type identifier, and pass the data to builder function
  4. Render the data in builder function
  **/
  createSection(sectionName, sectionDef) {

    let builder = this.builderDictionary[sectionDef].builder;
    let contentType = this.builderDictionary[sectionDef].contentType;

    let sectionEntries = this.state.content.filter((item) => {
      return item.sys.contentType.sys.id === contentType;
    }).sort((a, b) => {
      if(a.fields.priority) {
        return a.fields.priority - b.fields.priority;
      }else{
        return 0
      }
    }).map((dataEntry) => {
      return builder(dataEntry);
    });

    function setSectionShell(defId) {
      if(defId === "Contact") {
        return sectionEntries;
      }else if(defId === "Skills") {
        return (
          <Grid stackable columns={2}>
            {sectionEntries}
          </Grid>
        );
      }else{
        return (
          <Item.Group relaxed>
            {sectionEntries}
          </Item.Group>
        );
      }
    }
    let sectionInnerComponent = setSectionShell(sectionDef);

    return (
      <Segment vertical padded key={sectionName}>
        { sectionName &&
          <h2>{sectionName}</h2>
        }
        {sectionInnerComponent}
      </Segment>
    );

  }

  buildContact(contactEntry) {

    let entryFields = contactEntry.fields;
    const profiles = entryFields.publicProfile.map((profile, i) => {

      let iconName = profile.includes("git") ? "github square" :
                       profile.includes("linked") ? "linkedin square" :
                         "home";
      return (
        <a href={profile} key={profile}><Icon name={iconName} size="big" color="blue" /></a>
      );
    });

    return (
      <Card key={contactEntry.sys.id}>
        <Card.Content>
          <Card.Header>
            {entryFields.firstName} {entryFields.lastName}
          </Card.Header>
          <Card.Description>
            <p>{entryFields.eMail}</p>
            <p>{entryFields.phone}</p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
            {profiles}
        </Card.Content>
      </Card>
    );
  }

  buildWorkExp(workExpEntry) {

    let entryFields = workExpEntry.fields;
    let regExp = /[\d]{4}-[\d]{2}/;

    return (
      <Item key={workExpEntry.sys.id}>
        <Item.Content>
          <Item.Header as="h3">
            <a href={entryFields.companyWebsite}>{entryFields.company}</a>
          </Item.Header>
          <Item.Meta>
            {regExp.exec(entryFields.begin)[0]} ~ {regExp.exec(entryFields.end)[0]} &nbsp;
            <Label>
              <Icon name='user' /> &nbsp;
              {entryFields.position}
            </Label>
          </Item.Meta>
          <Item.Description dangerouslySetInnerHTML={createMarkup(entryFields.jobDescription)}></Item.Description>
        </Item.Content>
      </Item>
    );

  }

  buildSideProj(projEntry) {

    let entryFields = projEntry.fields;

    return (
      <Item key={projEntry.sys.id}>
        <Item.Content>
          <Item.Header as="h3">
            <a href={entryFields.portfolioWebsite}>{entryFields.projectName}</a>
          </Item.Header>
          <Item.Description dangerouslySetInnerHTML={createMarkup(entryFields.projectDescription)}></Item.Description>
        </Item.Content>
      </Item>
    );

  }

  buildSkills(skillsEntry) {

    let entryFields = skillsEntry.fields;
    let skillArr = entryFields.skillName.map((skill, i) => {
      return (
        <li key={i}>{skill}</li>
      );
    });

    return (
      <Grid.Column key={skillsEntry.sys.id}>
        <h3>{entryFields.skillGroupName}</h3>
        <ul>{skillArr}</ul>
      </Grid.Column>
    );

  }

  buildEdu(eduEntry) {

    let entryFields = eduEntry.fields;
    let regExp = /[\d]{4}-[\d]{2}/;

    return (
      <Item key={eduEntry.sys.id}>
        <Item.Content>
          <Item.Header as="h3">
            <a href={entryFields.instituteWebsite}>{entryFields.instituteName}</a>
          </Item.Header>
          <Item.Meta>
            {regExp.exec(entryFields.begin)[0]} ~ {regExp.exec(entryFields.end)[0]} &nbsp;
          </Item.Meta>
          <Item.Description>
            {entryFields.certificate}
          </Item.Description>
        </Item.Content>
      </Item>
    );

  }

  render() {

    let leftCols = [];
    let rightCols = [];
    if(this.state.content) {
      this.state.resumeDefinition.forEach((sectionDef) => {
        let section = this.createSection(sectionDef.sectionName, sectionDef.sectionId);
        if(sectionDef.sectionId === "Contact") {
          leftCols.push(section);
        }else{
          rightCols.push(section);
        }
      });
    };

    return(
      <Grid padded>
          <Grid.Column width={5}>
            {leftCols}
          </Grid.Column>
          <Grid.Column width={11}>
            {rightCols}
          </Grid.Column>
      </Grid>
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
export const styleName = "Simple Two Colums";
export const styleId = "simpleTwoCols";
