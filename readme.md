# comments4U
* Youtube Comments Crawling & Analysis Program for each channel
* Get ALL Comments from each video by video_id

# How to Use
1. Install Node.js
* Find how to install node.js
2. Install follow libraries
```bash
$ npm install async
$ npm install request
$ npm install fs
$ npm install date
```
3. Get API key for Youtube-API Data v3
4. Enter your API key into code
```javascript
var api_key = 'Enter your API Key';
```
5. Enter your channel's video id into code
```javascript
var channel_list = ['video1_id', 'video2_id'];
```
6. Just run it!
```bash
$ node getComments
```
