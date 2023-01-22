import { workingHours } from "./data.js";

$(function () {
  const currentTime = moment();
  //Get current day for header / jumbotron
  $("#currentDay").text(currentTime.format("dddd, MMMM, Do"));

  //Check if hours exist in localstorage if not use initial array from data file
  let hours = JSON.parse(localStorage.getItem("hours")) || workingHours;

  //Append timeBlock ellement wrapper to the page
  const timeBlockEl = $("<div>").addClass("time-block");

  //Function to cretae new row (single hour info)
  function createHourRow(hour, index) {
    const { time, message } = hour;
    const rowTime = moment(time, "h:Aa");

    //Assign appropriate class based on current time
    const textareaClass = currentTime.isAfter(rowTime, "hour")
      ? "past"
      : currentTime.isBefore(rowTime, "hour")
      ? "future"
      : "present";

    return `
        <div data-hour=${time}  data-index=${index} class="row">
          <div  class="hour col-sm-12 col-md-1">${time.replace(":", "")}</div>
          <textarea class='${textareaClass} col-sm-12 col-md-10'>${message}</textarea>
          <button class="saveBtn col-sm-12 col-md-1">
             <i class="fas fa-save"></i>
          </button>
        </div>
      `;
  }

  //Generate timeblock for each working hour and append totimeBlock element
  $.each(hours, function (index, hour) {
    $(timeBlockEl).append(createHourRow(hour, index));
  });

  //On click save to localStorage and show message
  $(timeBlockEl).on("click", ".saveBtn", function () {
    const message = $(this).siblings("textarea").val();
    const time = $(this).parent().data("hour");
    const currentRowIndex = $(this).parent().data("index");
    //update hours array
    hours[currentRowIndex] = { message, time };
    localStorage.setItem("hours", JSON.stringify(hours));

    const notification = `
      <h6 id="notification"> Appointment Added to the 
      <span>localStorage</span>
      <i class="fas fa-check"></i>
      </h6>`;
    showNotification(timeBlockEl, notification);
  });

  //Add created timeblocks on the page
  $(".container").append(timeBlockEl);
});

//Self removing notification
let timeOutId;
function showNotification(parrentEl, notification) {
  clearTimeout(timeOutId);
  $("#notification").remove();
  $(parrentEl).prepend(notification);
  timeOutId = setTimeout(() => {
    $("#notification").remove();
  }, 5000);
}