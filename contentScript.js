function createCanvas(elem, image) {
  var can = document.createElement('canvas');
  can.width = 197;
  can.height = 134;
  var ctx = can.getContext("2d");
  elem.parentNode.insertBefore(can, elem.nextSibling);
  try {
    ctx.drawImage(image,
      0, 0, image.width, image.height,
      0, 0, can.width, can.height);
  } catch (error) {
    console.log(error);
  }
  elem.style.display = "none";
}

function getSpanElems() {
  var cls = document.getElementsByClassName('entrylist-contents-thumb');
  var isu = document.getElementsByClassName('entrylist-issue-thumb');
  var map = new Map();
  for (const c in cls) {
    if (!cls.hasOwnProperty(c)) { continue; }
    const s = cls[c].querySelector('span');
    if (!s) { continue; }
    var imgurl = s.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
    map.set(s, imgurl);
  }
  for (const su in isu) {
    if (!isu.hasOwnProperty(su)) { continue; }
    const sp = isu[su].querySelector('span');
    if (!sp) { continue; }
    var imgurl = sp.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
    map.set(sp, imgurl);
  }

  return map
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    }
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

async function imagedetect() {
  var i = 0;
  for (var elem of spanurls) {
    chrome.runtime.sendMessage({ msg: 'url', data: elem[1], index: i }, function ({ msg, index, bb }) {
      var ctx = canvases[index].getContext("2d");
      ctx.lineWidth = 2;
      for (var j = 0; j < bb.length; j++) {
        const face = bb[j].boundingBox;
        ctx.strokeStyle = "black";
        ctx.fillRect(Math.floor(face.x * 0.47),
          Math.floor(face.y * 0.5),
          Math.floor(face.width * 0.6),
          Math.floor(face.height * 0.17));
      }

      console.log(msg, index, bb.length);
      if (bb.length) {
        console.log(JSON.stringify(bb));
      }
    });
    i++;

  }
}

async function setCanvas() {
  for (const spn of spanurls) {
    const res = await loadImage(spn[1]).catch(e => {
      console.log('onload error', e);
    });

    createCanvas(spn[0], res);

  }
  canvases = getCanElms();

}

async function getCanElms() {
  return document.getElementsByTagName('canvas')
}

async function main() {
  await setCanvas();
  canvases = await getCanElms();
  if (canvases.length) {
    imagedetect();
  }
}

var canvases;
var spanurls = getSpanElems();
main();
