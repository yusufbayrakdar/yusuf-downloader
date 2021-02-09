getUrl();
$("#download-btn").click(function () {
    downloadVideo();
});
$(function () {
    $("#loader").css("display", "none");
    $("#loader").load("./loader.html");
});