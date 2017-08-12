
var zmina = document.getElementById('zmina');
zmina.onclick = function(event) {
  event.preventDefault();
  event.stopPropagation();
  var dataForm = new FormData();
  var subjectname = document.getElementById('subject').value;
  var subjecturl = document.getElementById('subjecturl').value;
  var data = subjectname + '_' + subjecturl;
  dataForm.append('subject', data);
  $.ajax({
    type: 'POST',
    url: '/adminsetting',
    processData: false,
    data: dataForm,
    success: function(response) {
      if (response.status !== 'bad') {
        var newLi = document.createElement('li');
        newLi.innerHTML = '<a href=' + response.subject + '>' + response.subject + '</a>';
        var submenu = document.getElementById('submenu');
        submenu.appendChild(newLi);
        alert('Add new subject!');
      } else {
        alert('Файл с этим именем уже существует!');
      }

    }
  });
  $('#subject').val('');
  $('#subjecturl').val('');

};
