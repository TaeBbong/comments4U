// Getting ALL Comments by each videos on YouTube Channel using Youtube Data API v3

var async = require('async');
var request = require('request');
var fs = require('fs');
var date = require('date-utils');
var video_list = ['-1_I46R3GvI', 'Mx3-HeATdSc', 'k5DUhoa8P08' ,'ob7q9Rd5O8M', 'YhEZtBKYLs0'];
var api_key = require('config').api_key;
var base_url = 'https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=100';

function doRequest(url) {
  return new Promise(function(resolve, reject) {
    request({
      url: url,
      json: true
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) resolve(body);
      else reject(error);
    });
  });
}

for(const video of video_list){
  var init_url = base_url + '&key=' + api_key + '&videoId=' + video;
  var url = init_url;
  var mid_url = init_url;
  var newDate = new Date();
  var time = newDate.toFormat('YYYYMMDD_HH24:MI:SS');
  var file_name = video + '-' + time + '_comments' + '.txt';
  var file = fs.createWriteStream(file_name);
  var nextPageToken;
  var prevPageToken;
  var publishedAt;
  var pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  async function search_for_total(init_url, file, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList){
    async function search_for_500(){
      for(const page of pageList){
        let body = await doRequest(url);
        if(body != undefined){
          for (const item of body.items) {
            var comment = {'authorName': item.snippet.topLevelComment.snippet.authorDisplayName, 'text':item.snippet.topLevelComment.snippet.textOriginal.replace(/\n/g, '')};
            await file.write('authorName: ' + comment.authorName + ', text: ' + comment.text + '\n');
            nextPageToken = await body.nextPageToken;
            publishedAt = await item.snippet.publishedAt;
          }
          if(nextPageToken != 'endPage')
            url = await mid_url + '&pageToken=' + nextPageToken;
          if(nextPageToken == prevPageToken)
            return 'done';
          prevPageToken = nextPageToken;
        }
      }
      mid_url = await init_url + '&publishedBefore=' + publishedAt;
      url = mid_url;
      nextPageToken = 'endPage';
    }

    var i = 0;
    while(true){
      var r = await search_for_500();
      i = i + 1;
      if(i == 2)
        break;
    }
  }
  search_for_total(init_url, file, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList);
}
