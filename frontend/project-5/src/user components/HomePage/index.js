import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";

const HomePage = () => {
  const navigate = useNavigate();

  //the reason that i add the navigate because the user normally will put only the domain of the website so he will be redirected automatically the / route so he will enter the home component then he will be redirected to the rooms component
  useEffect(() => {
    navigate("/rooms");
  }, []);
};

export default HomePage; //if we use export default then when we import we dont use {} or an error will appear
