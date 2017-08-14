
$(document).ready(function() {
  $('button').click(function(event) {
    // alert($(this).val());
    event.preventDefault();
    event.stopPropagation();
    $(this).parent().remove();
    $.ajax({
      type: 'POST',
      url: '/books',
      processData: false,
      data: $(this).val(),
      success: function(response) {
        if (response.status === 'ok') {
          alert('Subject deleted!');
        } else {
          alert('Subject not deleted!');
        }
      }
    });
  });
});

// del.onclick = function(event) {
//   event.preventDefault();
//   event.stopPropagation();
//   var dataForm = new FormData();
//   var data = '';
//   dataForm.append('subject', data);
//   $.ajax({
//     type: 'POST',
//     url: '/adminsetting',
//     processData: false,
//     data: dataForm,
//     success: function(response) {
//       if (response.status !== 'bad') {
//         var newLi = document.createElement('li');
//         newLi.innerHTML = '<a href=' + response.routes.url + '>' + response.routes.name + '</a>';
//         var submenu = document.getElementById('submenu');
//         submenu.appendChild(newLi);
//         alert('Add new subject!');
//       } else {
//         alert('Файл с этим именем уже существует!');
//       }
//
//     }
//   });
//   $('#subject').val('');
//   $('#subjecturl').val('');
//
// };
