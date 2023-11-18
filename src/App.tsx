import { useCallback, useMemo, useState } from 'react'
import './App.css'


function speech(text: string, voice: SpeechSynthesisVoice): Promise<void> {
  const ut = new SpeechSynthesisUtterance(text);
  ut.voice = voice;
  window.speechSynthesis.speak(ut);

  return new Promise((resolve) => {
    let setintervalId: NodeJS.Timer | undefined;

    function whileSpeaking() {
      if (!setintervalId) {
        return;
      }

      const stopSpeack = !window.speechSynthesis.speaking;
      if (stopSpeack) {
        clearInterval(setintervalId);
        resolve();
      }
    }

    setintervalId = setInterval(whileSpeaking, 100)
  })
}

export function App() {
  const [inputText, setInputText] = useState("");
  const [isSpeecking, setIsSpeecking] = useState(false);

  const [selectedIndexVoice, setSelectedIndexVoice] = useState<number>(0);

  const voices = window.speechSynthesis.getVoices();
  const currentVoice = useMemo(
    () => (selectedIndexVoice !== null && voices[selectedIndexVoice]) || null,
    [voices, selectedIndexVoice]
  )

  const handleSpeechText = useCallback(async () => {
    if (!currentVoice || inputText === "") {
      return;
    }

    setIsSpeecking(true);
    await speech(inputText, currentVoice);
    setIsSpeecking(false);
  }, [currentVoice, inputText]);


  const disableInputText = isSpeecking;
  const disableSelectVoice = isSpeecking;
  const disableButtonSpeech = inputText === "" || currentVoice === null || isSpeecking;

  return (
    <>
      <header className='header'>
        <h1>Convertendo Texto em Audio</h1>
      </header>
      <main className='main'>
        <textarea
          name="text"
          disabled={disableInputText}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} />
        <select
          name="voice"
          disabled={disableSelectVoice}
          onChange={(e) => setSelectedIndexVoice(parseInt(e.target.value))}
        >
          {voices.map((voice, index) => (
            <option key={voice.name} value={index}>{voice.name}</option>
          ))}
        </select>
        <button onClick={handleSpeechText} disabled={disableButtonSpeech}>Falar</button>
      </main>
    </>
  )
}

