//since we used export directly then when we import we have to add the {} or an error will occur

import "./style.css";

export const RightThisRoom = () => {
  return (
    <>
      <div className="right-this-room">
        <div className="specific-size-for-right">
          <p>
            this is the right side which contains the data for the specified
            room
          </p>
        </div>
      </div>
    </>
  );
};
