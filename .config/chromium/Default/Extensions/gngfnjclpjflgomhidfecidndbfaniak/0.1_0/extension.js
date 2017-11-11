var popupContent = $("<div id='StyleSheet_Count_pop_up'> </div>");
popupContent.css({
    background: "#c3c3c3",
    "box-shadow": "0 0 6px",
    "border-radius": "10px",
    padding: "50px"
});
var stylesheetLength = document.styleSheets.length;
popupContent.html("<h1 style='display:inline'>Stylesheet tag count: </h1> <div style='font-size:24px; color:blue'>" + stylesheetLength + "</div>"), $("body").append(popupContent), $("#StyleSheet_Count_pop_up").bPopup({
    positionStyle: "fixed",
    transition: "fadeIn",
    transitionClose: "fadeIn",
    speed: 250,
    autoClose: 3000,
    position: [500, 10],
    modal: !1
});
