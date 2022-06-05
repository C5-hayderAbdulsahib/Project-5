import LeftMyRooms from "../LeftMyRooms";
import { RightThisRoom } from "../RightThisRoom"; //since we used export directly then we have to use the {} when importing

import "./style.css";

const HomePage = () => {
  return (
    <>
      <div className="home-page">
        <div className="grid-split-components">
          {/* <div className="right-this-room">
            <RightThisRoom />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HomePage; //if we use export default then when we import we dont use {} or an error will appear
