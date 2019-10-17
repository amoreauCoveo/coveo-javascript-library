## Coveo JavaScript Library - A Coveo Search and Push Library

The Coveo JavaScript Library has two main purposes: searching in a Coveo organization, and pushing items to Coveo.

## Getting Started

This library depends on the [`request` npm library](https://www.npmjs.com/package/request).

To install this library, enter `npm i request` in a terminal opened to the folder of your project.

## Coveo.search

By using `Coveo.search`, you can perform a search to your organization.

This function allows for a total of five potential options:

```javascript
Coveo.search(settings, query, searchcallback, analyticssettings, analyticscallback)
```

- `settings` (object or string): if it is not an object, `settings` should contain a valid API key. Otherwise, it can contain the following options:
    - `apiKey` (string): a valid API key, with the `search` permission
    - `orgId` (string, optional): the Id of the organization to query
    - `analyticsKey` (string, optional): an API key to use to send analytics. If absent, the `apiKey` value is used instead
    - `env` (string, optional): the Coveo environment to query. Defaults to the production environment when unspecified
- `query` (object or string): Ii it is not an object, `query` will be send as a `q` parameter during your search. Otherwise, it can contain any valid query parameter (see [Query Parameters](https://docs.coveo.com/en/1461/cloud-v2-developers/query-parameters)).
- `searchcallback` (function): the callback function. It returns:
    - `error` (object): any error that could have occurred when querying your organization.
    - `response` (object): the full response of the query, including the status code.
    - `results` (object): the result of your query.
- `analyticssettings` (object, optional): the settings for the analytics call made after the search. When unspecified, no analytics call is made. Can contain any data used for logging usage analytics events (see [Logging Usage Analytics Events](https://docs.coveo.com/en/1373/cloud-v2-developers/logging-usage-analytics-events)). The following options will be overridden by the data taken from the search query:
    - `searchQueryUid`
    - `queryText`
    - `advancedQuery`
    - `numberOfResults`
    - `responseTime`
    - `queryPipeline`
- `analyticscallback` (object, optional): the callback function after the analytics call. It returns:
    - `error` (object): any error that could have occurred when sending the analytics event.
    - `response` (object): the full response of the analytics call, including the status code.
    - `results` (object): the body of the analytics call.

### Sending a basic search

The following code sample represents the most bare-bone way to perform a search to your Coveo organization using this library.

While not recommended for production code, it can be used to quickly test and experiment.

```javascript
const Coveo = require('Coveo');

const settings = "my-api-key";

const query = "my query term"

Coveo.search(settings, query, function(error, response, results) {
    if (error) {
        console.log(error);
    }
    // `response` contains the full response of the API call.
    // `results` contains the results of the query you made.
});
```

### Sending a full-fledged search

The following code sample represents a more complete request to perform a search to your Coveo organization using this library.

```javascript
const Coveo = require('Coveo');

const settings = {
    apiKey: "my-api-key",
    orgId: "my-organization-id",
    analyticsKey: "my-analytics-key"
}

const query = {
    q: "my query term"
}

const analyticsSettings = {
    originLevel1: "MyCustomCode"
}

Coveo.search(settings, query, function(error, response, results) {
    if (error) {
        console.log(error);
    }
    // `response` contains the full response of the API call.
    // `results` contains the results of the query you made. 
}, analyticsSettings, function(error, response, body){
    if (error) {
        console.log('Error sending analytics event:', error);
    }
    // `response` contains the full response of the API call.
    // `body` contains the body of the call.
})
```

## Coveo.analytics

By using `Coveo.analytics`, you can send analytics events to your Coveo organization.

Note that the `Coveo.search` function can automatically send analytics events when provided with the proper settings.

```javascript
Coveo.analytics.send(settings, data, callback)
```

This function accepts the following options:
- `settings` (object): can contain the following values:
    - `apiKey` (string): a valid API key to push the analytics data
    - `orgId` (string, optional): the id of the organization to push the data to
    - `env` (string, optional): the Coveo environment to send the data to. Defaults to the production environment when unspecified
- `data` (object): the analytics data to send
- `callback` (function, optional): the callback function after the analytics call. It returns:
    - `error` (object): any error that could have occurred when sending the analytics event.
    - `response` (object): the full response of the analytics call, including the status code.
    - `results` (object): the body of the analytics call.

## Coveo.push

By using `Coveo.push`, you can add or remove items from your Push source in your Coveo organization. This method offers the following functions:

- `Coveo.push.one`: to push a single document in your source
- `Coveo.push.batch`: to push multiple documents in a single source
- `Coveo.push.delete`: to delete a single document in your source
- `Coveo.push.deleteOld`: to delete all documents older than a specified time

### Coveo.push.one

```javascript
Coveo.push.one(settings, document, callback)
```

This function pushes a single document to a Push source in your Coveo organization. You should only use this function when you want to send one document to your index. Sending too many documents at once with this function may lead to a `429` response, where your item will not be indexed.

It accepts the following options:
- `settings` (object): can contain the following values:
    - `apiKey` (string): a valid API key for your organization
    - `orgId` (string): the id of your Coveo organization
    - `sourceId` (string): the id of your target push source
    - `env` (string, optional): the Coveo environment to send the data to. Defaults to the production environment when unspecified
- `document` (object): a valid document to send to your push source. Ideally, create it using [`Coveo.Document`](#coveodocument).
- `callback` (function): the callback function. It returns:
    - `error` (object): any error that could have occurred when pushing the document.
    - `response` (object): the full response of the API call, including the status code.
    - `body` (object): the body of the API call - usually empty when successful.

### Coveo.push.batch

```javascript
Coveo.push.batch(settings, documents, callback)
```

This function pushes a batch of documents to a Push source in your Coveo organization. You should always use this function when sending multiple documents to your index.

It accepts the following options:
- `settings` (object): can contain the following values:
    - `apiKey` (string): a valid API key for your organization
    - `orgId` (string): the id of your Coveo organization
    - `sourceId` (string): the id of your target push source
    - `maxSize` (int, optional): the maximum size (in bytes) of the batch to send. Defaults to 256 MB when not specified.
    - `env` (string, optional): the Coveo environment to send the data to. Defaults to the production environment when unspecified
- `documents` (array of objects): an array of valid documents to send to your push source. Ideally, they were created using [`Coveo.Document`](#coveodocument).
- `callback` (function): the callback function. It returns:
    - `error` (object): any error that could have occurred when pushing the documents.
    - `response` (object): the full response of the API call, including the status code.
    - `body` (object): the body of the API call - usually empty when successful.

### Coveo.push.delete

```javascript
Coveo.push.delete(settings, uri, callback)
```

This function deletes a single document from a Push source in your Coveo organization.

It accepts the following options:
- `settings` (object): can contain the following values:
    - `apiKey` (string): a valid API key for your organization
    - `orgId` (string): the id of your Coveo organization
    - `sourceId` (string): the id of your target push source
    - `env` (string, optional): the Coveo environment to send the data to. Defaults to the production environment when unspecified
- `uri` (string or object): the URI of the document to delete. Alternatively, you can provide an object with a `uri` value.
- `callback` (function): the callback function. It returns:
    - `error` (object): any error that could have occurred when deleting the document.
    - `response` (object): the full response of the API call, including the status code.
    - `body` (object): the body of the API call - usually empty when successful.

### Coveo.push.deleteOld

```javascript
Coveo.push.deleteOld(settings, timestamp, callback)
```

This function deletes all documents older than the specified timestamp.

It accepts the following options:
- `settings` (object): can contain the following values:
    - `apiKey` (string): a valid API key for your organization
    - `orgId` (string): the id of your Coveo organization
    - `sourceId` (string): the id of your target push source
    - `env` (string, optional): the Coveo environment to send the data to. Defaults to the production environment when unspecified
- `timestamp` (int, optional): a Unix timestamp before which all documents will be deleted. When not provided, the timestamp will be the time when the code is run.
- `callback` (function): the callback function. It returns:
    - `error` (object): any error that could have occurred when deleting documents.
    - `response` (object): the full response of the API call, including the status code.
    - `body` (object): the body of the API call - usually empty when successful.

## Coveo.Document

This class allows you to create a document already formatted to be pushed to Coveo.

### Constructor

The constructor accepts the following options:

```javascript
let myDocument = Coveo.Document(uri, body, fields);
```
- `uri` (string): the URI of the document to push
- `body` (string, optional): the data of your document. For a web page, this would be the HTML markup of that page
- `fields` (object, optional): additional fields to add to your document

### Functions

This class also offers functions to add permissions to your document.
- `addEmailPermissions(allowedEmails, deniedEmails)`: adds indivudal permissions on a document.
    - `allowedEmails` (array of strings): all emails to allow on the document
    - `deniedEmails` (array of strings): all emails to deny on the document
- `addGroupPermissions(allowedGroups, deniedGroups)`: adds group permissions on a document
    - `allowedGroups` (array of strings): all groups to allow on the document
    - `deniedGroups` (array of strings): all groups to deny on the document
- `addVirtualGroupPermissions(allowedGroups, deniedGroups)`: add virtual group permission on a document
    - `allowedGroups` (array of strings): all groups to allow on the document
    - `deniedGroups` (array of strings): all groups to deny on the document
- `addCascadingPermissions(allowedGroups, deniedGroups, groupType, groupNumber)`:
    - `allowedGroups` (array of strings): all groups to allow on the document
    - `deniedGroups` (array of strings): all groups to deny on the document
    - `groupType` (string): the type of group for the users. Can be `User`, `Group`, or `VirtualGroup`.
    - `groupNumber` (int, optional): the index of the permission set to add the permissions to. When no number is provided, a new one is created with the provided permissions.

### Usage Example

```javascript
const Coveo = require('Coveo');

const myUri = 'http://example.com';
const myDocumentBody = 'This is the text that contains the bulk of the data.';
const additionalFields = {
    title: "While not mandatory, it is usually a good idea to add a title to your document",
    author: "Coveo",
    moreInfo: "All the fields in this object will be added to your document in the proper format."
}

// Create the document
let myDocument = new Coveo.Document(myUri, myDocumentBody, additionalFields);


// You can also add permissions to your document, when needed.

// For individual permissions
const allowedUsers = ['alice@example.com', 'bob@example.com'];
const deniedUsers = ['charlie@example.com'];
myDocument.addEmailPermissions(allowedUsers, deniedUsers);

// For groups
const allowedGroups = ['Management', 'HR'];
const deniedGroups = ['RD', 'Marketing'];
myDocument.addGroupPermissions(allowedGroups, deniedGroups);

// Adding cascading permissions, creating a new set of permissions
const allowedCascadingGroups = ['MyOtherGroup'];
const deniedCascadingGroups = ['ADeniedGroup'];
myDocument.addCascadingPermissions(allowedCascadingGroups, deniedCascadingGroups, 'VirtualGroup')
```