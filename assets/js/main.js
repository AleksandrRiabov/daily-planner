import { workingHours } from "./data.js";


$(function () {
  //Get current day for jumbotron
  $('#currentDay').text(moment().format('dddd, MMMM, Do'));

  //Check if hours exist in localstorage if not use initial array from data file
  let hours = JSON.parse(localStorage.getItem('hours')) || workingHours;

  //Append timeBlock ellement wrapper to the page
  const timeBlock = $('<div>').addClass('time-block');

  //Function to cretae new row/hour info
  function createHourRow(hour, index) {
    const { time, message } = hour;
    //asign appropriate class deppending on time.
    const textareaClass =
      moment(time, 'h').format('h') < moment().format('h') ?
        'past' :
        moment(time, 'h').format('h') > moment().format('h') ?
          'future' :
          'present'

    return `
        <div  data-hour=${time}  data-index=${index} class="row">
          <div  class="hour col-sm-1">${time}</div>
          <textarea class='${textareaClass} col-sm-10'>${message || ''}</textarea>
          <button class="saveBtn col-sm-1">
          <i class="fas fa-save"></i>
          </button>
        </div>
      `
  }


  //Generate timeblock for each working hour
  $.each(hours, function (index, hour) {
    $(timeBlock).append(createHourRow(hour, index));
  });

  //On click save to localStorage and show message
  $(timeBlock).on('click', '.saveBtn', function () {
    const message = $(this).parent().children('textarea').val();
    const time = $(this).parent().data('hour');

    hours[$(this).parent().data('index')] = { message, time };
    localStorage.setItem('hours', JSON.stringify(hours));

    const notification = `
    <h6 id="notification"> Appointment Added to the 
    <span>localStorage</span>
    <i class="fas fa-check"></i>
    </h6>`
    notify(timeBlock, notification)
  })

  //Add created timeblocks on the page
  $('.container').append(timeBlock);
});


//Self removing notification
let timeOutId;
function notify(timeBlock, notification) {
  clearTimeout(timeOutId);
  $('#notification').remove();
  $(timeBlock).prepend(notification);
  timeOutId = setTimeout(() => {
    $('#notification').remove();
    console.log('removed')
  }, 5000)
}