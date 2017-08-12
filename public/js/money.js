//
// function pay() {
//   var data = document.getElementById('money').value;
//   $.ajax({
//     url: '/about',
//     data: data,
//     cache: false,
//     contentType: false,
//     processData: false,
//     type: 'POST',
//     success: function(response) {
//       if (response.status === 'ok') {
//         document.getElementById('money').text = '<%=money%>';
//       } else {
//         alert('Не достатньо на рахунку!');
//       }
//     }
//   });
//   alert(data);
//   document.getElementById('money').value = data - 50;
// };
