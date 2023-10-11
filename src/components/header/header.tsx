import React, {useEffect, useState} from 'react'
import {BsToggleOff, BsToggleOn} from "react-icons/bs"
import {BiArrowBack, BiMicrochip} from 'react-icons/bi';
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {googleLogout} from "@react-oauth/google";
import userAction from "../../redux/actions/user";
import {useToggle} from "@uidotdev/usehooks";
import codeStore from "../../stores/code.store";
import AvrgirlArduino from "avrgirl-arduino";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import './header.css';

declare global {
  interface Window {
    AndroidBridge: {
      hexDataUploadToAndroidDevice: (data: string) => void;
    };
  }
}

function Header(props) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [browserSupported, updateBrowserSupported] = useState(true);
  const [fileArrayBuffer, setFileArrayBuffer] = useState(null);
  const [showDialog, toggleDialog] = useToggle(false);
  const [dialogText, setDialogText] = useState("");

  function handleCode() {
    props.func(!props.code);
  }

  function handleSimulator() {
    props.simulatorfunc(true);
    props.playfunc(true);
  }

  useEffect(() => {
    updateBrowserSupported('serial' in navigator);
  }, [])

  const history = useHistory();

  const hexCodeGeneration = async () => {
    let data
    let arduinoCode
    codeStore.subscribe(code => {
      arduinoCode = code.code
    })
    console.log('arduinocode = ', arduinoCode)
    try {
      const resp = await fetch('https://dev-api.arduino.merakilearn.org/get-code', {
        method: "POST",
        body: JSON.stringify({
          code: arduinoCode
        }),
        headers: {
          'content-type': 'application/json;charset=utf-8'
        }
      })
      data = await resp.arrayBuffer();
      const textDecoder = new TextDecoder('utf-8');
      const decodedData = textDecoder.decode(data)
      console.log('decoded data = ', decodedData)
      console.log('HexFile Data from API', decodedData)
      window.AndroidBridge.hexDataUploadToAndroidDevice(decodedData)
    } catch (e) {
      setDialogText("Fetch failed")
      console.log('Fetch failed ', e)
      return
    }
    setDialogText("Fetch of hex file completed from server")
  }

  const createNotification = (type: string, error: string) => {
    switch (type) {
      case 's1':
        NotificationManager.success('Flash done', "CODE BURN COMPLETE");
        break;
      case 's2':
        NotificationManager.info('Fetch of hex file completed from server');
        break;
      case 's3':
        NotificationManager.error('Fetch of hex file failed from server', error);
        break;
      case 's4':
        NotificationManager.error(error, "ERROR");
        break;
    }
  };

  const handleDownload = async () => {
    let data
    let arduinoCode
    codeStore.subscribe(code => {
      arduinoCode = code.code
    })
    console.log('arduinocode = ', arduinoCode)
    try {
      const resp = await fetch('https://dev-api.arduino.merakilearn.org/get-code', {
        method: "POST",
        body: JSON.stringify({
          code: arduinoCode
        }),
        headers: {
          'content-type': 'application/json;charset=utf-8'
        }
      })
      data = await resp.arrayBuffer();

    } catch (e) {
      e += '';
      createNotification('s3', e);
      setDialogText("Fetch failed")
      console.log('Fetch failed ', e)
      return
    }

    createNotification('s2', 'nil');
    setDialogText("Fetch of hex file completed from server")
    setFileArrayBuffer(data);
    const avrgirl = new AvrgirlArduino({
      board: "uno",
      debug: true,
    });
    avrgirl.flash(data, error => {
      if (error) {
        error += '';
        createNotification('s4', error);
        console.log("error = ", error);
      } else {
        createNotification('s1', 'nil');
        setDialogText("Flash done")
        console.log("flash done")
      }
    })
  }

  const logoutUser = () => {
    googleLogout();
    dispatch(userAction.loginFromGoogle(null));
    dispatch(userAction.setCurrentUser(null));
    history.push("/")
  }

  return (
      <header className="w3-bar w3-top w3-light-green w3-text-black" style={{height: "40px"}}>
        <div className="w3-bar-item w3-padding">
          <BiArrowBack onClick={logoutUser}/>
        </div>
        <div className="w3-bar-item w3-right w3-medium" style={{alignItems: "center", display: "flex"}}
             onClick={handleSimulator}>
          <div style={{whiteSpace: 'pre-wrap', cursor: "default"}}> Play Simulator</div>
        </div>
        <div className='show-on-mobile'>
          <div className="w3-bar-item w3-right w3-medium" style={{alignItems: "center", display: "flex"}}
               onClick={hexCodeGeneration}>
            <BiMicrochip/>
            <div style={{whiteSpace: 'pre-wrap', cursor: "default"}}> Code Burn(Android)</div>
          </div>
        </div>
        <div className='hide-on-mobile'>
          <div className="w3-bar-item w3-right w3-medium" style={{alignItems: "center", display: "flex"}}
               onClick={handleDownload}>
            <BiMicrochip/>
            <div style={{whiteSpace: 'pre-wrap', cursor: "default"}}> Code Burn</div>
          </div>
        </div>
        <div className="w3-bar-item w3-right w3-medium" style={{alignItems: "center", display: "flex"}}
             onClick={handleCode}>
          {props.code ? <BsToggleOn/> : <BsToggleOff/>}
          <div style={{whiteSpace: 'pre-wrap', cursor: "default"}}> Enable Code View</div>
        </div>
        <NotificationContainer/>
      </header>
  )
}
export default Header
