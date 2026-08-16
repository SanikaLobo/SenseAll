import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
const PUBLISHABLE_ROBOFLOW_API_KEY = 'rf_c7rnF41caQUNdCaF2OOuzwzExHS2';
const PROJECT_URL = "isl-actions";
const MODEL_VERSION = 3;


const Translate = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [inferRunning, setInferRunning] = useState(false);
  const [model, setModel] = useState(null);
  const [detectedVariables, setDetectedVariables] = useState("");
  const [responser, setResponser]=useState(null);
  const [modeVar,setModeVar]=useState('');
  // let result=""
  let prevs=[]
  let cache={}
  let freq={}
  let res=''
  let arrres=[]
  let last;
  const counter=useRef(0);
  const startInfer = () => {
    setInferRunning(true);
    window.roboflow
      .auth({
        publishable_key: PUBLISHABLE_ROBOFLOW_API_KEY,
      })
      .load({
        model: PROJECT_URL,
        version: MODEL_VERSION,
        onMetadata: function (m) {
          console.log("model loaded");
        },
      })
      .then((loadedModel) => {
        setModel(loadedModel);
      });
  };

  useEffect(() => {
    if (inferRunning && model) {
      const inferInterval = setInterval(() => {
        detect(model);
      }, 10);

      return () => clearInterval(inferInterval);
    }
  }, [inferRunning, model]);

  const stopInfer = () => {
    setInferRunning(false);
    if (model) model.teardown();
  };
  const detect = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      adjustCanvas(videoWidth, videoHeight);

      const detections = await model.detect(webcamRef.current.video);

      const formattedDetections = formatDetections(detections);
      if (formattedDetections){
      // result+=`${formattedDetections} `
      prevs.push(formattedDetections)

      if (formattedDetections in cache){
      cache[formattedDetections]+=1
      }
      else{
        cache[formattedDetections]=1
      }
      for (let key in cache){
        freq[cache[key]]=key
      }
      console.log(freq)
      last = Object.keys(freq)[Object.keys(freq).length-1]
      if (counter.current%3==0 ){
      counter.current+=1
      res+=`${freq[last]} `
      arrres.push(freq[last])
      cache={}
      freq={}

      setModeVar(res)
      console.log(res)
      }
      }
      setDetectedVariables((prev) => prev + formattedDetections);
      if (formattedDetections && prevs[prevs.length-1]!=prevs[prevs.length-2]){
        counter.current++;
      }
      
      console.log(counter.current)
      if (arrres.length>=4) {
        counter.current=0
        geminiNeta(res);
        arrres=[]
      }
      const ctx = canvasRef.current.getContext("2d");
      drawBoxes(detections, ctx);
    }
  };
  
  const formatDetections = (detections) => {
    let formatted = "";
    detections.forEach((variable) => {
      formatted += `${variable.class}, `;
    });
    return formatted;
  };

  const adjustCanvas = (w, h) => {
    canvasRef.current.width = w * window.devicePixelRatio;
    canvasRef.current.height = h * window.devicePixelRatio;

    canvasRef.current.style.width = w + "px";
    canvasRef.current.style.height = h + "px";

    canvasRef.current
      .getContext("2d")
      .scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  const drawBoxes = (detections, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach((row) => {
      if (true) {
        var temp = row.bbox;
        temp.class = row.class;
        temp.color = row.color;
        temp.confidence = row.confidence;
        row = temp;
      }

      if (row.confidence < 0) return;

      var x = row.x - row.width / 2;
      var y = row.y - row.height / 2;
      var w = row.width;
      var h = row.height;

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = row.color;
      ctx.rect(x, y, w, h);
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.2;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1.0;

      var fontColor = "black";
      var fontSize = 12;
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      var classTxt = row.class;

      const textHeight = fontSize;

      ctx.strokeStyle = row.color;
      ctx.fillStyle = row.color;
      ctx.fillRect(
        x - ctx.lineWidth / 2,
        y - textHeight - ctx.lineWidth,
        w + ctx.lineWidth,
        textHeight + ctx.lineWidth
      );
      ctx.stroke();
      ctx.fillStyle = fontColor;
      ctx.fillText(classTxt, x + w / 2, y - 1);
    });
  };

  const  geminiNeta=(words)=>{
    const formdata = new FormData();
  formdata.append("text", words);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };
  fetch("https://9b07-103-220-42-139.ngrok-free.app/gemini_api", requestOptions)
    .then((response) => response.json())
    .then((result) => setResponser(result["data"]))
    .catch((error) => console.error(error));

  prevs=[]
  res=""
  setModeVar(res)
  setDetectedVariables("")
  }

  return (
    <div >
      <h4 className="jumbotron">⚠️ Model is sensitive and can lead to wrong predictions in worse conditions.</h4>
      <div className="webcam">
      <div >
        <Webcam className='inside'
          ref={webcamRef}
          muted={true}
          videoConstraints={{width: 800, height: 600}}
        />
        <canvas className='inside'
          ref={canvasRef}
        />
      </div>
      <div >
      <div className="detect">
          <textarea className='textareab'defaultValue={responser} placeholder="Translation..."></textarea>
        </div>
      </div>
      </div>
        <div className="btn" >
          
          {inferRunning ? (
            <button onClick={stopInfer} >
             STOP
            </button>
          ) : (
            <button onClick={startInfer}>
             START
            </button>
          )}
        </div>
    </div>
  );
};

export default Translate;
