# Resume-Friend
Present resume and cover letter with different styles

## Why Build This
I would like to have a tailor-made resume and a cove letter for each potential employers, but not to create them as bunch of .docx files, which according to my previous experience will end up with a hell of maintenence work. Since the display style and part of the content are reusable, it should be nice if I can compose the final document wtih "content parts" and desired style definition.

## How Does It Work
Basically it is a very simple front-end react app, which does the following
1. Load available resume and/or cover letter data
2. Load available styles for both data type
3. Mix and match data and style

The work of data part is mostly taken care of by the freemium service of [Contentful](https://www.contentful.com/), which delivers my data with simple API and has a web application for data schema and management. The work of display part is done by react components placed in /src/skins folder. The UI simply provide interface to choose between those data and components.
