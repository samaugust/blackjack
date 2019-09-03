import React from "react";
import "./RigDeckCheckbox.scss";

const RigDeckCheckbox = ({ toggleIsRiggedForSplits }) => (
  <div className="rig-deck-wrapper">
    <input
      type="checkbox"
      style={{ width: "20px", height: "20px" }}
      id="rig-deck-checkbox"
      onChange={e => toggleIsRiggedForSplits(e.target.checked)}
    />
    <label className="rig-deck-label" htmlFor="rig-deck-checkbox">
      Get dealt a splittable hand
    </label>
  </div>
);

export default RigDeckCheckbox;
