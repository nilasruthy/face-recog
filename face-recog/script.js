const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream
    },(err) => console.error(err))
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    let detections, counter = 0
    setInterval(async () => {
      detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    }, 100)
    setInterval(() => {
        if(detections) {
            if(Object.keys(detections).length > 0) {
                if(detections[0]._score > 0.25) {
                    counter += 1
                }
            }
        }
    }, 1000)
    setInterval(() => {
        if(counter > 0) {
            console.log("Interested")
            counter = 0
        }
        else {
            console.log("Not Interested")
        }
    }, 1000 * 3)
})