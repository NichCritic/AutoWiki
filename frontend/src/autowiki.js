/*global: Pen*/
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



var timer = ResettableTimer({
  time: 10000,
  cb: function() {
    window.alert("Save");
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
});
