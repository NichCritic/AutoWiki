/*global: Pen*/
/*jslint unused:false*/
function main() {
// config
  var options = {
    // toolbar: document.getElementById('custom-toolbar'),
    editor: document.querySelector('[data-toggle="pen"]'),
    debug: true,
    list: [
      'insertimage', 'blockquote', 'h2', 'h3', 'p', 'code', 'insertorderedlist', 'insertunorderedlist', 'inserthorizontalrule',
      'indent', 'outdent', 'bold', 'italic', 'underline', 'createlink'
    ]
  };

  // create editor
  var pen = window.pen = new Pen(options);

  pen.focus();

  var listFiles = function() {
    var request = gapi.client.request({
        'path': '/drive/v3/files',
        'method': 'GET',
        'params': {
                   'spaces':'appDataFolder',
                  },
        'headers': {}
    });
    return request;
  };

  var retrieveFileById = function(id) {
    var request = gapi.client.request({
        'path': '/drive/v3/files/'+id+'?alt=media',
        'method': 'GET',
        'params': {'spaces':'appDataFolder',
                    'mimeType': 'text/html'},
        'headers': {}
    });
    return request;
  };

  var createFileWithHTMLContent = function(name,data) {
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var contentType = 'text/html';

    var metadata = {
        'name': name,
        'mimeType': contentType,
        'parents': ['appDataFolder']
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });
    return request; 
  };


  var timer = new ResettableTimer({
    time: 10000,
    cb: function() {
      var title = document.querySelector('#title').innerHTML;
      if (title !== '') {
        var date = (new Date()).toISOString();
        createFileWithHTMLContent(title+"_"+date+".html", document.querySelector('.pen').innerHTML).then(function(response) {
          switch(response.status){
            case 200:
              var file = response.result;
              console.log('Created Folder Id: ', file.id);
              break;
            default:
              console.log('Error creating the folder, '+response);
              break;
          }
        });
      }
    }
  });

  document.querySelector('.pen').addEventListener('input', function() {
    timer.reset();
  });

  // toggle editor mode
  document.querySelector('#mode').addEventListener('click', function () {
    if (this.classList.contains('disabled')) {
      this.classList.remove('disabled');
      pen.rebuild();
    } else {
      this.classList.add('disabled');
      pen.destroy();
    }
  });

  // export content as markdown
  document.querySelector('#tomd').addEventListener('click', function () {
    var text = pen.toMd();
    document.body.innerHTML = '<a href="javascript:location.reload()">&larr;back to editor</a><br><br><pre>' + text + '</pre>';
  });


  var setContents = function(data){

    pen.setContent(data.body);      
  };

  // var loadFileAndDisplay = function(fileId) {
  //     return retrieveFileById(fileId).then(setContents);
  // }

  // toggle editor mode
  document.querySelector('#hinted').addEventListener('click', function () {
    var pen = document.querySelector('.pen');

    if (pen.classList.contains('hinted')) {
      pen.classList.remove('hinted');
      this.classList.add('disabled');
    } else {
      pen.classList.add('hinted');
      this.classList.remove('disabled');
    }

    listFiles().then(function(data){
      console.log(data);
      //Need to handle no files found

      var list = document.createElement('ul');
      for (var n in data.result.files) {
        if (data.result.files.hasOwnProperty(n)){
          var file = data.result.files[n];
          var item = document.createElement('li');
          item.appendChild(document.createTextNode(data.result.files[n].name));
          list.appendChild(item);
          
        }
      }

      document.querySelector('#filelist').appendChild(list);
      document.querySelector('#filelist').removeAttribute('hidden');
    });

  });
}
