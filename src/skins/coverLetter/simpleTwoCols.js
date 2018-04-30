import React, { Component } from 'react';
import {Card, Grid, Icon} from 'semantic-ui-react'

var Remarkable = require("remarkable");
var md = new Remarkable({breaks: true});

function createMarkup(data) {
  return {__html: md.render(data)};
}

var paddingFix = {
  paddingTop: 21 + "px",
  paddingBottom: 21 + "px"
}

class CoverLetter extends Component {

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

  buildLetterContent(contentMarkdown) {
    return(
      <p dangerouslySetInnerHTML={createMarkup(contentMarkdown)}></p>
    );
  }

  render() {

    let contact = this.buildContact(this.props.content.contact);
    let letterContent = this.buildLetterContent(this.props.content.letterContent);

    return(
      <Grid padded>
          <Grid.Column width={5}>
            <div style={paddingFix}>{contact}</div>
          </Grid.Column>
          <Grid.Column width={11}>
            <div style={paddingFix}>{letterContent}</div>
          </Grid.Column>
      </Grid>
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
export const styleName = "Simple Two Colums";
export const styleId = "simpleTwoCols";
