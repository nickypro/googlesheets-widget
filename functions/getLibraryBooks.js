const {google} = require('googleapis');

async function getLibraryBooks(SHEETS_ID) {
  //create a google sheets login
  const client = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  
  //connect to google sheets
  await client.authorize( (err, token) => {
    if (err){
      console.error(err)
      return
    } 
    //if connected to google sheets, be happy
    console.log("Connected to google sheets")
  })
  
  const gsapi = google.sheets({
    version: "v4",
    auth: client
  })

  const options = {
    spreadsheetId: SHEETS_ID,
    range: "Sheet1!A2:G",
    valueRenderOption: "FORMULA"
  }

  let data = await gsapi.spreadsheets.values.get(options);

  let books = []

  for (i in data.data.values) {
    let book = data.data.values[i]
    
    //get the link from the titles
    let title, link
    if ( book[0].match("HYPERLINK") ) {
      url  = book[0].split('","')[0].replace(`=HYPERLINK("`, "")
      title = book[0].split('","')[1].replace(`")`, "")
    } else {
      title = book[0] 
    }

    books.push({
      url, 
      title,
      "author"    : data.data.values[i][1],
      "available": (data.data.values[i][3] == "Available"),
    })
  }

  return books
}

module.exports = getLibraryBooks
