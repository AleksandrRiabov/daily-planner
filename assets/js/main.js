$(function () {
  $('#currentDay').text(moment().format('dddd, MMMM, Do'));



  function createRow(hour) {
    const { time, text } = hour;

    const textareaClass =
      moment(time, 'h').format('h') < moment().format('h') ?
        'past' :
        moment(time, 'h').format('h') > moment().format('h') ?
          'future' :
          'present'

    return row = `
        <div class="row">
          <div class="hour col-sm-1">${time}</div>
          <textarea class='${textareaClass} col-sm-10'>${text}</textarea>
          <button class="saveBtn col-sm-1">Save</button>
        </div>
      `
  }


  $('.container').append(createRow({ time: '2pm', text: 'Hello, I have an appointment at this time!' }));



});



