import { workingHours } from "./data.js";

$(function () {
  const currentTime = moment();
  //Get current day for header / jumbotron
  $("#currentDay").text(currentTime.format("dddd, MMMM, Do"));

  //Check if hours exist in the localStorage, if not use initial array from the data file
  let hours = JSON.parse(localStorage.getItem("hours")) || workingHours;

  // Get container element from HTML
  const timeBlocksContainer = $(".time-blocks");

  //Function to create new row (single hour info block)
  function createHourRow(hour, index) {
    const { time, message } = hour;
    const rowTime = moment(time, "h:Aa");

    //Assign class based on the current time
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

  //Generate row for each working hour and append to the timeBlocksContainerEl.
  $.each(hours, function (index, hour) {
    $(timeBlocksContainer).append(createHourRow(hour, index));
  });

  //On click save to the localStorage and display notification message
  $(timeBlocksContainer).on("click", ".saveBtn", function () {
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
    showNotification(timeBlocksContainer, notification);
  });
});

//Self removing notification
let timeOutId;
function showNotification(parrentEl, notification) {
  clearTimeout(timeOutId);
  $("#notification").remove();
  $(parrentEl).prepend(notification);
  timeOutId = setTimeout(() => {
    $("#notification").remove();
  }, 4000);
}