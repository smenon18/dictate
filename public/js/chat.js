// grab the room from the URL
var room = "main";
var timing = null;

// create our webrtc connection
var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: true
});

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
    // you can name it anything
    webrtc.joinRoom(room);
});

function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) volume = -45; // -45 to -20 is
    if (volume > -20) volume = -20; // a good range
    el.value = volume;
}

// we got access to the camera
webrtc.on('localStream', function (stream) {
    var button = document.querySelector('form>button');
    if (button) button.removeAttribute('disabled');
    $('#localVolume').show();
});
// we did not get access to the camera
webrtc.on('localMediaError', function (err) {
});

// local screen obtained
webrtc.on('localScreenAdded', function (video) {
    video.onclick = function () {
        video.style.width = video.videoWidth + 'px';
        video.style.height = video.videoHeight + 'px';
    };
    document.getElementById('localScreenContainer').appendChild(video);
    $('#localScreenContainer').show();
});
// local screen removed
webrtc.on('localScreenRemoved', function (video) {
    document.getElementById('localScreenContainer').removeChild(video);
    $('#localScreenContainer').hide();
});

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    if (remotes) {
        var container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);

        // suppress contextmenu
        video.oncontextmenu = function () { return false; };

        // resize the video on click
        video.onclick = function () {
            container.style.width = video.videoWidth + 'px';
            container.style.height = video.videoHeight + 'px';
        };

        // show the remote volume
        var vol = document.createElement('meter');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume';
        vol.min = -45;
        vol.max = -20;
        vol.low = -40;
        vol.high = -25;
        container.appendChild(vol);

        // show the ice connection state
        if (peer && peer.pc) {
            var connstate = document.createElement('div');
            connstate.className = 'connectionstate';
            container.appendChild(connstate);
            peer.pc.on('iceConnectionStateChange', function (event) {
                switch (peer.pc.iceConnectionState) {
                case 'checking':
                    connstate.innerText = 'Connecting to peer...';
                    break;
                case 'connected':
                case 'completed': // on caller side
                    $(vol).show();
                    connstate.innerText = 'Connection established.';
                    break;
                case 'disconnected':
                    connstate.innerText = 'Disconnected.';
                    break;
                case 'failed':
                    connstate.innerText = 'Connection failed.';
                    break;
                case 'closed':
                    connstate.innerText = 'Connection closed.';
                    break;
                }
            });
        }
        remotes.appendChild(container);
    }
});
// a peer was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
});

// local volume has changed
webrtc.on('volumeChange', function (volume, treshold) {
    showVolume(document.getElementById('localVolume'), volume);
});
// remote volume has changed
webrtc.on('remoteVolumeChange', function (peer, volume) {
    showVolume(document.getElementById('volume_' + peer.id), volume);
});

// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('local fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('remote fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});


if (!('webkitSpeechRecognition' in window)) {
  console.log("Unavailable");
} else {
  var final_transcript = '';
  var interim_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event)
  {
    if(event.error === 'no-speech')
    {
      ignore_onend = true;
    }
    if(event.error === 'audio-capture')
    {
      ignore_onend = true;
    }
    if(event.error === 'not-allowed')
    {
      if(event.timeStamp - start_timestamp < 100)
      {
        console.log('info_blocked');
      }
      else
      {
        console.log('info_denied');
      }

      ignore_onend = true;
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = "";
    clearTimeout(timing);
    if(typeof(event.results) === 'undefined')
    {
      recognition.onend = null;
      recognition.stop();
      return;
    }

    for(var i = event.resultIndex; i < event.results.length; i++)
    {
      if(event.results[i].isFinal)
      {
        final_transcript += event.results[i][0].transcript;
      }
      else
      {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    final_transcript = capitalize(final_transcript);
    perm_span.innerHTML = '';
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);

    if(event.results[event.results.length - 1].isFinal)
    {
      recogCheck();
      clearTimeout(timing);
      timing = setTimeout(recogCheck, 500);
    }else {
      clearTimeout(timing);
      timing = setTimeout(recogCheck, 3000);
    }
  };

  recognition.onend = function()
  {
    recognizing = false;
    if(ignore_onend)
    {
      return;
    }
    if(!final_transcript)
    {
      return;
    }

    if(window.getSelection)
    {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  }

  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s)
  {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  var first_char = /\S/;
  function capitalize(s)
  {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }

  var index = 0;
  var text = '';

  function recogCheck()
  {
    if (recognizing)
    {
      index++;
      if(text !== final_span.innerHTML) {
        $('#results').append('<div id="post-' + index + '" class="well-sm">' +
            '<b>' + sessionStorage.user + '</b><br>' + new Date().toLocaleString() + '<br><p>' + final_span.innerHTML.substring(text.length, final_span.innerHTML.length + 1)  + '</p></div>');
        text = final_span.innerHTML;
      }
      recognition.stop();
      return;
    }
    recognition.start();
    ignore_onend = false
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_timestamp = new Date().toLocaleString();
  }
}

recognition.start();
