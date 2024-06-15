const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const recordingAnimation = document.getElementById('recording-animation');
const recordingsList = document.getElementById('recordingsList');

let mediaRecorder;
let chunks = [];

startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                chunks.push(event.data);
            };

            startButton.disabled = true;
            stopButton.disabled = false;
            recordingAnimation.style.display = 'block';
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
            type: 'audio/ogg; codecs=opus'
        });
        const audioURL = window.URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        audio.controls = true;

        const recordingDiv = document.createElement('div');
        recordingDiv.classList.add('recording');

        const titleInput = document.createElement('input'); // Title
        titleInput.type = 'text';
        titleInput.placeholder = 'Enter recording title';
        titleInput.classList.add('title-input');

        recordingDiv.appendChild(titleInput);
        recordingDiv.appendChild(audio);

        const result = document.createElement('input'); // result
        result.type = 'text';
        result.placeholder = 'Speech Emotion';
        result.classList.add('title-input');

        recordingDiv.appendChild(result);

        recordingsList.appendChild(recordingDiv);

        chunks = [];
    };

    startButton.disabled = false;
    stopButton.disabled = true;
    recordingAnimation.style.display = 'none';
});