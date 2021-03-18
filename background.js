chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {

  if (message.msg === "url") {
    const img = new Image();

    img.onload = () => {
      var faceDetector = new FaceDetector({
        fastMode: true
      });
      faceDetector.detect(img)
        .then(faces => {
          senderResponse({ msg: "ok", index: message.index, bb: faces });
        });
    }
    img.onerror = (e) => console.log(e);
    img.src = message.data;

    return true;
  }
});