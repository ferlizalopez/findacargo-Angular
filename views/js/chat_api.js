/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.

 * Cashif */

// global variable for latest message id
var latest_msg_id = 0;

/*
 * -------------------------------------------------------
 *  Subscribe to this user's own channel for notifications
 * -------------------------------------------------------
 */
$(document).ready(function(){
    $.getScript('http://js.pusher.com/3.0/pusher.min.js', function(){
        var pusher = new Pusher('ed1edc67bfc5a99939f1', { authEndpoint: '/chat/pusher/auth' });
        var channel = pusher.subscribe(user_id);
        channel.bind('notification', function(data) {
            console.log(data);
            incr_total_unread_count();
            incr_unread_count(data.chat);
        });
        
        /* Bind to the Presence channel to show online status */
        var channel = pusher.subscribe('presence-fac');
        channel.bind('pusher:subscription_succeeded', function(members) {});
    });
});

/*
 * --------------------------------------------------------
 *  Methods to send and receive messages
 * --------------------------------------------------------
 * 
 */

function send_msg(user_id, order_id, message)
{
    message = message.trim();
    
    var data = {
        order_id: order_id,
        sender_id: user_id,
        message: message
    };
    
    var data = new FormData();
    data.append('order_id', order_id);
    data.append('sender_id', user_id);
    data.append('message', message);
    
    var files_attached = false;
    
    // Check for attachments
    if(typeof files !== 'undefined' && files.length > 0)
    {
        files_attached = true;
        for(i in files)
        {
            data.append('files', files[i], files[i].name);
        }
    }
    
    if(message.length == 0 && !files_attached)
        return;
    
    $.ajax({
            type: "POST",
            url: '/chat/api',
            data: data,
            success: function(d){console.log(d)},
            cache: false,
            contentType: false,
            processData: false
          });
          
          /*
    $.post('/chat/api', data, function(data){
        if(data)
        {
            if(data.status && data.status == 'success')
            {
                var post_id = data.id;
                latest_msg_id = data.id;
            }
        }
    }, 'json');
    */
}

function get_msgs(user_id, order_id, since)
{
    // No more being used. Messages pushed by pusher.com
    return;
    var data = {
        order_id: order_id,
        user_id: user_id,
        since: latest_msg_id
    };
    
    $.get('/chat/api', data, function(data){
        
        if(data)
        {
            if(data.status == 'success')
            {                
                render_msgs(data.msgs,data.userImagePath,data.mineImagePath);
                scroll_chat_to_bottom();
            }
        }
    }, 'json');
}

function render_msgs(msgs,userImagePath,mineImagePath)
{
    var chat_cont = $(".chat-discussion");
    for(var i = 0; i < msgs.length; i++)
    {
        var msg = msgs[i];
        
        latest_msg_id = msg._id;
        
        if(msg.sender_id == user_id)
            chat_cont.append(chat_message_mine(msg,mineImagePath));
        else
            chat_cont.append(chat_message_other(msg,userImagePath));
    }
    scroll_chat_to_bottom();
}


/*
 * Two function who return just HTML. must be replaced by some sort of templates
 */
function chat_message_other(msg,otherImagePath)
{
 
    var attachments = get_attachments_html(msg);
    var imagePath = "";
    if(otherImagePath == null || otherImagePath == undefined || otherImagePath == "" ) {
        imagePath = '/img/user.png';
    } else {
        imagePath = otherImagePath;
    }

    var css = '';
    if(msg.read == 0)
        css = ' unread ';
    
    var attachments = get_attachments_html(msg);
        
    var html = "<div class='chat-message left ' > \
                    <img class='message-avatar' src='"+ imagePath +"' alt=''> \
                    <div class='message "+ css +"' data-msg-id='"+ msg._id +"'> \
                        <a class='message-author' href='#'> "+ other_name +"  </a> \
                        <span class='message-date' data-time='"+ msg.date +"'> </span> \
                        <span class='message-content'>" +
                            msg.message + attachments +
                        "</span> \
                    </div> \
                </div>";
    return html;
}

function chat_message_mine(msg,mineImagePath)
{
    var attachments = get_attachments_html(msg);
    var imagePath = "";
    if(mineImagePath == null || mineImagePath == undefined || mineImagePath == "" ) {
        imagePath = '/img/user.png';
    } else {
        imagePath = mineImagePath;
    }

    
    var html = "<div class='chat-message right' > \
                    <img class='message-avatar' src='"+ imagePath +"' alt=''> \
                    <div class='message' data-msg-id='"+ msg._id +"'> \
                        <a class='message-author' href='#'> " + my_name + "</a> \
                        <span class='message-date' data-time='"+ msg.date +"'> </span> \
                        <span class='message-content'>" +
                            msg.message + attachments +
                        "</span> \
                    </div> \
                </div>";
    return html;
}

// Get HTML code which shows the attached files
// @param: msg = the message object from db
function get_attachments_html(msg)
{
    if(msg.hasOwnProperty('files'))
    {
        console.log(msg.files);
        var files = JSON.parse(msg.files);
    
        var files_html = '';
        for(i in files)
        {
            files_html += "<br /> <i class='fa fa-paperclip'></i> <a href='/chat/get_file/" + files[i].saved_name + "'>"+ files[i].name +"</a>";
        }
        
        return files_html;
    }
    
    return '';
}

/*
 * Function invoked on clicking "send message" button
 */
function prepare_and_send()
{
    var msg = $("textarea[name=message]").val();
    $("textarea[name=message]").val("");
    send_msg(user_id, order_id, msg);
    clear_files();
}

// helper function to scroll chat box to bottom
function scroll_chat_to_bottom()
{
    $('.chat-discussion').scrollTop($('.chat-discussion').prop("scrollHeight"));
}

/*
 * ----------------------------------------------------
 *  Methods to check when message is seen
 * ----------------------------------------------------
 */

$(document).ready(function(){

    // On acquiring focus, check if any new unread messages are visible
    $(window).focus(function() {
        CheckForVisibleMessages();
    });

    // Add onScroll event to chat_window, check visible messages on scroll
    $("#chat_window").scroll(function(){
        if(document.hasFocus())
            CheckForVisibleMessages();
    });
    
    if(typeof is_chat_page !== 'undefined')
        CheckForVisibleMessages();
});

function CheckForVisibleMessages()
{
    checkChildInView($('#chat_window'), '.unread', function(x){
            x.removeClass('unread');
            mark_as_read(x.attr("data-msg-id"));
        });
}

/*
 * Checks all the childs of 'el' filtered by 'selector' if they are in view then run 'funct'
 * @param {element} el          Parent Element
 * @param {string} selector     Selector
 * @param {function} funct      Function to run
 * @returns {none}
 */
function checkChildInView(el, selector, funct)
{
    $(el).find(selector).each(function(i){
        if(isInView($(this), el))
            funct($(this));
    });
}

/*
 * Checks if the child is in view relative to parent
 * @child   element     child element
 * @parent  element     parent element
 */
function isInView(child, parent)
{
    var cRect = child[0].getBoundingClientRect();
    var pRect = parent[0].getBoundingClientRect();
    
    if(cRect.top > pRect.top && cRect.bottom < pRect.bottom)
        return true;
    else
        return false;
}

function mark_as_read(msg_id)
{
    $.post('/chat/api/mark_read', {message_id: msg_id}, function(data){
        if(data)
        {
            if(data.status && data.status == 'success')
            {
                console.log('message marked as read');
                
                // caution: we are using global 'chat' object to decrement notification count
                decr_total_unread_count();
                decr_unread_count(chat._id);
            }
        }
    }, 'json');
}


/*
 * -------------------------------------------------------------------
 *  Handling Unread Messages Count
 * -------------------------------------------------------------------
 */

$(document).ready(function(){
    $.get('/chat/api/unread_msgs', function(data){
        if(data)
        {
            // Update total unread messages in top bar
            if(data.hasOwnProperty('total_unread_count') && data.total_unread_count > 0)
                $('#unread_msg_count').html(data.total_unread_count).show();
            else
                $('#unread_msg_count').hide();
            
            if(data.hasOwnProperty('chats'))
            {
                for(i in data.chats)
                {
                    if(data.chats[i].unread_count > 0)
                        render_unread_chat_notification(data.chats[i]);
                }
            }
        }
    });
});

function incr_total_unread_count()
{
    var count = parseInt($('#unread_msg_count').html());
    count = isNaN(count)?0:count;
    $('#unread_msg_count').html(count+1).show();
}

function decr_total_unread_count()
{
    var count = parseInt($('#unread_msg_count').html());
    if(count == 1)
        $('#unread_msg_count').html(count-1).hide();
    else
        $('#unread_msg_count').html(count-1);
}

function incr_unread_count(chat)
{
    if($('#msg_notif_'+chat._id).length)
    {
        var count = parseInt($('#msg_notif_'+chat._id).find('.unread_count').html());
        count = isNaN(count)?0:count;
        $('#msg_notif_'+chat._id).find('.unread_count').html(count+1);
        
        // update time
        $('#msg_notif_'+chat._id).find('.notif-time').attr('data-time', new Date().toISOString());
        updateNotificationTimes();
    }
    else
    {
        chat.unread_count = 1;
        render_unread_chat_notification(chat);
    }
}

function decr_unread_count(chat_id)
{
    if($('#msg_notif_'+chat_id).length)
    {
        var count = parseInt($('#msg_notif_'+chat_id).find('.unread_count').html());
        $('#msg_notif_'+chat_id).find('.unread_count').html(count-1);
        
        if(count-1 == 0)
        {
            // Zero unread messages. Remove the notification
            $('#msg_notif_'+chat_id).next('.divider').remove();
            $('#msg_notif_'+chat_id).remove();
        }
    }
}

function render_unread_chat_notification(chat)
{
    if($('#msg_notif_'+chat._id).length)
    {
        // Notification is already there, just update the unread count
        $('#msg_notif_'+chat._id).find('.unread_count').html(chat.unread_count);
    }
    else
    {
        // Calculate the time of last message
        if(chat.hasOwnProperty('last_message_time'))
            last_message_time = chat.last_message_time;
        else
            last_message_time = new Date().toISOString();
        
        var formattedTime = timeToDescription(last_message_time);
        
        // Push this notification to notification menu
        var html = "<li id='msg_notif_"+ chat._id +"'> \
                        <div class='dropdown-messages-box'> \
                            <a href='#' class='pull-left'> \
                                    <img alt='image' src='/img/a7.jpg' class='img-circle'> \
                            </a> \
                            <div class='media-body'> \
                                <small class='pull-right badge badge-warning unread_count'>" + chat.unread_count + "</small> \
                                <a href='/chat/id/"+ chat._id +"' style='color:#676a6c; padding:0'> \
                                    <strong>" + chat.name+ "</strong> \
                                </a> \
                                <br> \
                                <small class='text-muted notif-time' data-time='"+last_message_time+"'>"+ formattedTime +"</small> \
                            </div>\n\
                        </div>\n\
                    </li>\
                    <li class='divider'>\
                    </li>";
        $("#unread_msgs").html(html + $("#unread_msgs").html());
    }
    updateNotificationTimes();
}

/*
 * -------------------------------------------------------------------
 *  Time Functions
 * -------------------------------------------------------------------
 */

// If it is a chat page, then periodically update time of all chats
$(document).ready(function(){
    if(typeof is_chat_page !== 'undefined')
    {
        setInterval(updateAllTimes, 10 * 1000);
        updateAllTimes();
    }
    setInterval(updateNotificationTimes, 10 * 1000);
});


function updateAllTimes()
{
    $('.message-date').each(function(d){
        $(this).text(timeToDescription($(this).attr('data-time')));
    });
}

function updateNotificationTimes()
{
    $('.notif-time').each(function(d){
        $(this).text(timeToDescription($(this).attr('data-time')));
    });
}

function timeToDescription(time) {
  if(typeof time === 'string')
      time = new Date(Date.parse(time.trim()));
  else if(typeof time === 'number')
  {
      time = new Date(time);
  }
  else if(typeof time == Date)
  {
      
  }
  else
      return time;

  var desc = "dunno";
  var now = new Date();
  var howLongAgo = (now - time);
  var seconds = Math.round(howLongAgo/1000);
  var minutes = Math.round(seconds/60);
  var hours = Math.round(minutes/60);
  if(seconds <= 0) {
    desc = "just now";
  }
  else if(minutes < 1) {
    desc = seconds + " second" + (seconds !== 1?"s":"") + " ago";
  }
  else if(minutes < 60) {
    desc = "about " + minutes + " minute" + (minutes !== 1?"s":"") + " ago";
  }
  else if(hours < 24) {
    desc = "about " + hours + " hour"  + (hours !== 1?"s":"") + " ago";
  }
  else {
    desc = time.getDay() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][time.getMonth()]
  }
  return desc;
};