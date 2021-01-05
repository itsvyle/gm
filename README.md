# gm
* **GM is a javascript browser library created by me (`@itsvyle`) to facilitate the use of javascript in browser.**
* **It permits the creation of short code blocks to make simple animations or interactivity.**
* **It should be compatible with most versions of javascript, even the older ones**

## Importation
**Import from GitHub**
```html
<html>
  <head>
    <title>GM !</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://raw.githubusercontent.com/itsvyle/gm/main/gm.js" type="application/javascript"></script>
    <link href="https://raw.githubusercontent.com/itsvyle/gm/main/gm.css" rel="stylesheet">
  </head>
  <body>
    <!--put whatever code here-->
  </body>
</html>
```

# Functions
*Add `gm.` in front of every one of those*

* **`onload(clb : function)`**: Clb will be called on the html document load
* **`newItem(nodeName : string,[options : object,[parent : node]]) : node`**: Creates a new HTML node. All the `options` will be assigned to the object, and the object will be appended to `parent` (if provided). Returns the created node
* **`request(url : string,[options : object = {}],callback : function) : void`**: Makes a webrequest (XMLHttp) to the `url`. See the explications by scrolling down.
* **`formatNumber(n : number) : string`**: formats the number `n` into a more readable string. (Example: 1234 = "1'234")
* **`validateOptions(obj : object,defaults : object,[required : array]) : boolean|string`**: Checks the validity of an object (`obj`). It will merge it with the defaults and check the required fields in the object.
* **`copyText(text : string) : void`**: Copies text to the clipboard.
* **`changeURL(url : string,[title : string]) : void`**: Changes the url that is shown in the url bar of the client. Title is purely optionnal, made to go in the browser history
* **`UTCTime([date : Date = new Date()]) : number`**: Gets the UTC timestamp for a `date`.
* **`multilineTextArea(textarea : HTML Textarea,[minheight_ : number = textarea.clientHeight,[submit : function]],`**: 

## gm.request(url : string,[options : object = {}],callback : function)
GET Request:
```javascript
//A normal GET request
request("https://www.example.com",null,function (r) {
  if (r.status !== 1) { /*There was an error in making the web request*/
    console.error(r.error);
    return;
  }
  console.log(r.res);
});
//A GET request with a json format return
request("https://www.example.com/example.json",{json: true},function (r) {
  if (r.status !== 1) { /*There was an error in making the web request OR the request return was unreadable JSON*/
    console.error(r.error);
    return;
  }
  console.log(r.res);
});
```

POST Request:
```javascript
//A simple POST request with a json return. We will be sending login credentials
request("/login",{
  json: true,
  method: "POST",
  body: "username=user&password=pwd"
},function (r) {
  if (r.status !== 1) { /*There was an error in making the web request OR the request return was unreadable JSON*/
    console.error(r.error);
    return;
  }
  console.log(r);
});
```
