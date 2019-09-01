import React from "react";
import "./RigDeckCheckbox.scss";

const RigDeckCheckbox = ({ onChange }) => (
  <div className="rig-deck-checkbox-wrapper">
    <label htmlFor="rig-deck-checkbox">Get dealt a splittable hand</label>
    <input type="checkbox" id="rig-deck-checkbox" onChange={onChange} />
  </div>
);

export default RigDeckCheckbox;
