    var col_orange = "#FF8400";
    var col_red = "#ff4c4c"

    $(document).ready(function() {

        //
        var hash = window.location.hash;
        if (hash === "#thankyou") {
            hideform();

            $("#subscribe-result").css("color", col_orange);
            $("#subscribe-result").html("Thank you for subscribing! Pinmap loves you.");
        }


        ajaxMailChimpForm($("#mc-embedded-subscribe-form"), $("#subscribe-result"));

        function ajaxMailChimpForm($form, $resultElement) {
                $form.submit(function(e) {
                    e.preventDefault();
                    if (!isValidEmail($form)) {
                        var error = "Yo bro, that's not a real email address.";
                        $resultElement.html(error);
                        $resultElement.css("color", col_red);
                    } else {
                        $resultElement.css("color", col_orange);
                        $resultElement.html("Subscribing...");
                        submitSubscribeForm($form, $resultElement);
                    }
                });
            }
            // Validate the email address in the form
        function isValidEmail($form) {
                // If email is empty, show error message.
                // contains just one @
                var email = $form.find("input[type='email']").val();
                if (!email || !email.length) {
                    return false;
                } else if (email.indexOf("@") == -1) {
                    return false;
                }
                return true;
            }
            // Submit the form with an ajax/jsonp request.
            // Based on http://stackoverflow.com/a/15120409/215821
        function submitSubscribeForm($form, $resultElement) {
            $.ajax({
                type: "GET",
                url: $form.attr("action"),
                data: $form.serialize(),
                cache: false,
                dataType: "jsonp",
                jsonp: "c", // trigger MailChimp to return a JSONP response
                contentType: "application/json; charset=utf-8",
                error: function(error) {
                    // According to jquery docs, this is never called for cross-domain JSONP requests
                },
                success: function(data) {
                    if (data.result != "success") {
                        var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                        var message = message.replace("0 - ", "");
                        $resultElement.css("color", col_red);
                        if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                            message = "You're already subscribed. Thank you.";
                            $resultElement.css("color", col_orange);
                            hideform();
                        }
                        $resultElement.html(message);
                    } else {
                        $resultElement.css("color", col_orange);
                        $resultElement.html("Thank you! Please confirm the subscription in your inbox.");
                        hideform();
                    }
                }
            });
        }

        function hideform() {
            $("#mce-EMAIL").css('visibility', 'hidden')
            $("#submit-btn").css('visibility', 'hidden')
        }
    });