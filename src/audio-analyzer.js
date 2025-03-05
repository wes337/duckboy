var audioContext = null;
var analyser = null;

export default function audioAnalyzer(audio) {
  const initAudioContext = () => {
    if (audioContext) {
      return analyser;
    }

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      return analyser;
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
      return null;
    }
  };

  const tryInitAudio = () => {
    if (!audioContext) {
      initAudioContext();
      document.removeEventListener("click", tryInitAudio);
      document.removeEventListener("touchstart", tryInitAudio);
    }
  };

  document.addEventListener("click", tryInitAudio);
  document.addEventListener("touchstart", tryInitAudio);

  return (callback) => {
    if (!analyser) {
      analyser = initAudioContext();
    }

    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      let value = null;

      for (let i = 0; i < bufferLength; i++) {
        const amount = dataArray[i];
        if (amount !== 0 && (value == null || dataArray[i] < value)) {
          value = dataArray[i];
        }
      }

      if (callback) {
        if (value == null) {
          callback(1);
        } else {
          callback((1 + parseInt(value / 4) / 100).toFixed(2));
        }
      }
    }
  };
}
