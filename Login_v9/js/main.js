
(function ($) {
    "use strict";

    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })    
    })

    $("#signUpAcc").hide()
    $("#enterTimes").hide()
    $("#timeLeft").hide()

    $("#aliveTree").hide()
    $("#deadTree").hide()
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        })
    });

    $("#signin").click(function() {
        auth()
    });

    $("#signup").click(function() {
        createAcc()
    });


    $("#savedetails").click(function() {
        enterTimes()
    });

    $("#signUpLink").click(function() {
        $("#signInAcc").hide()
        $("#signUpAcc").show()
    });

    $("#signInLink").click(function() {
        $("#signUpAcc").hide()
        $("#signInAcc").show()
    })

    $("#editdetails").click(function() {
        $("#timeLeft").hide()
        $("#enterTimes").show()
    })

    function auth() {
        var username = $("#username").val().toLowerCase();
        var password = $("#password").val();


        
        firebase.auth().signInWithEmailAndPassword(username + "@sleepwatch.com", password).then(function(result) {
            $("#signInAcc").fadeOut()
            $("#timeLeft").fadeIn()
            startLoop()
        }, function(error) {

        });
    }

    function createAcc() {
        $("#signInAcc").hide();

        var username = $("#username1").val().toLowerCase();
        var password = $("#password1").val();

        firebase.auth().createUserWithEmailAndPassword(username + "@sleepwatch.com", password).then(function(result) {
            $("#signUpAcc").fadeOut();
            $("#enterTimes").fadeIn();
        }, function(error) {

        });
    }

    function sanitize(num) {
        if (num.toString().length == 1) {
            return "0" + num.toString()
        } else {
            return num.toString()
        }
    }

    function enterTimes() {

        var start = $("#startTime").val();
        var startHour = parseInt(start.slice(0, 2))
        var startMin = parseInt(start.slice(3, 5))
        var end = $("#endTime").val()
        var endHour = parseInt(end.slice(0, 2))
        var endMin = parseInt(end.slice(3, 5))

        if (start.slice(-2) == "PM") {
            startHour += 12
        }
        if (end.slice(-2) == "PM") {
            endHour += 12
        }



        firebase.database().ref(getUsername()).set({
            startTime: sanitize(startHour) + ":" + sanitize(startMin),
            endTime: sanitize(endHour) + ":" + sanitize(endMin)
        });

        $("#enterTimes").hide()
        $("#timeLeft").show()

    }

    function startLoop() {
        getTimeRemaining()
        setInterval(getTimeRemaining, 5000)
    }

    function getTimeRemaining() {
        firebase.database().ref(getUsername()).once('value').then(function(snapshot) {
            var timeLeft = snapshot.val().timeLeft
            var streaks = snapshot.val().streaks
            console.log(timeLeft)
            $("#timeLeftData").html(timeLeft)
            if (streaks == 0) {
                $("#aliveTree").hide()
                $("#deadTree").show()
            } else {
                $("#deadTree").hide()
                $("#aliveTree").show()
            }
        })
    }

    $('#startTime').timepicker({
        timeFormat: 'hh:mm p',
        interval: 30,
        minTime: '0',
        maxTime: '11:30pm',
        defaultTime: '11',
        startTime: '0',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });

    $('#endTime').timepicker({
        timeFormat: 'hh:mm p',
        interval: 30,
        minTime: '0',
        maxTime: '11:30pm',
        defaultTime: '11',
        startTime: '0',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });


    function getUsername() {
        var user = firebase.auth().currentUser.email
        var i = user.indexOf("@")
        return user.slice(0, i)
    }

     function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');

        $(thisAlert).append('<span class="btn-hide-validate">&#xf135;</span>')
        $('.btn-hide-validate').each(function(){
            $(this).on('click',function(){
               hideValidate(this);
            });
        });
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(thisAlert).find('.btn-hide-validate').remove();
    }
    
    $("#test").html("Testing")

})(jQuery);