// Handle errors.
let handlefail = function (err) {
  console.log(err);
};

// Add video streams to the container.
function addVideoStream(streamId) {
  console.log();
  // Query the container to which the remote stream belong.
  let remoteContainer = document.getElementById("remoteStream");
  // Creates a new div for every stream
  let streamDiv = document.createElement("div");
  // Assigns the elementId to the div.
  streamDiv.id = streamId;
  // Takes care of the lateral inversion
  streamDiv.style.transform = "rotateY(180deg)";
  streamDiv.style.height = "250px";
  // Adds the div to the container.
  remoteContainer.appendChild(streamDiv);
}

document.getElementById("join").onclick = function () {
  let channelName = document.getElementById("channelName").value;
  let Username = document.getElementById("username").value;
  let appId = "e230b70835a14c70900c7652aec194b7";

  // create a client
  let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
  });

  client.init(
    appId,
    () => console.log("AgoraRTC Client Connected"),
    handlefail
  );

  // join a channel
  client.join(null, channelName, Username, () => {
    // create a local stream
    var localStream = AgoraRTC.createStream({
      video: true,
      audio: true,
    });

    // initalize the local stream
    localStream.init(function () {
      // play the local stream
      localStream.play("SelfStream");
      console.log(`App id: ${appId}\nChannel id: ${channelName}`);
      // publish a local stream
      client.publish(localStream);
    });
  });

  // Subscribe to the remote stream when it is published
  client.on("stream-added", function (evt) {
    console.log("Added Stream");
    client.subscribe(evt.stream, handlefail);
  });

  // Play the remote stream when it is subsribed
  client.on("stream-subscribed", function (evt) {
    console.log("Subscribed Stream");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });
};
