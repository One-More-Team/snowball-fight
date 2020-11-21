import React from "react";
import style from "./lobby.module.scss";
//import { initConnection } from "../../store/actions/common";

const Lobby = () => {
  //const dispatch = useDispatch();
  /* const connectAndStart = (mode) => dispatch(initConnection(mode)); */

  /* const [mode, setMode] = useState(""); */

  /* const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  }; */

  return <div className={style.wrapper}>Lobby</div>;
};

export default Lobby;
