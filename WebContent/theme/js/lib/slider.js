// JavaScript Document
        var SlideWidth = 550;
        var SlideSpeed = 500;

        $(document).ready(function () {
            // set the prev and next buttons display
            SetNavigationDisplay();
        });

        function CurrentMargin() {
            // get current margin of slider
            var currentMargin = $("#slider-wrapper").css("margin-left");

            // first page load, margin will be auto, we need to change this to 0
            if (currentMargin == "auto") {
                currentMargin = 0;
            }

            // return the current margin to the function as an integer
            return parseInt(currentMargin);
        }

        function SetNavigationDisplay() {
            // get current margin
            var currentMargin = CurrentMargin();

            // if current margin is at 0, then we are at the beginning, hide previous
            if (currentMargin == 0) {
                $("#PreviousButton").hide();
            }
            else {
                $("#PreviousButton").show();
            }

            // get wrapper width
            var wrapperWidth = $("#slider-wrapper").width();

            // turn current margin into postive number and calculate if we are at last slide, if so, hide next button
            if ((currentMargin * -1) == (wrapperWidth - SlideWidth)) {
                $("#NextButton").hide();
            }
            else {
                $("#NextButton").show();
            }
        }

        function NextSlide() {
            // get the current margin and subtract the slide width
            var newMargin = CurrentMargin() - SlideWidth;

            // slide the wrapper to the left to show the next panel at the set speed. Then set the nav display on completion of animation.
            $("#slider-wrapper").animate({ marginLeft: newMargin }, SlideSpeed, function () { SetNavigationDisplay() });
        }

        function PreviousSlide() {
            // get the current margin and subtract the slide width
            var newMargin = CurrentMargin() + SlideWidth;

            // slide the wrapper to the right to show the previous panel at the set speed. Then set the nav display on completion of animation.
            $("#slider-wrapper").animate({ marginLeft: newMargin }, SlideSpeed, function () { SetNavigationDisplay() });
        } 