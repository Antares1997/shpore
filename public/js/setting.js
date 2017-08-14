// 
// event.preventDefault();
// event.stopPropagation();
// var dataForm = new FormData();
// var subjectname = document.getElementById('subject').value;
// var subjecturl = document.getElementById('subjecturl').value;
// var data = subjectname + '_' + subjecturl;
// dataForm.append('subject', data);
// $.ajax({
//   type: 'POST',
//   url: '/setting',
//   processData: false,
//   data: dataForm,
//   success: function(response) {
//     if (response.status !== 'bad') {
//       alert('Add new subject!');
//     } else {
//       alert('Файл с этим именем уже существует!');
//     }
//
//   }
// });
