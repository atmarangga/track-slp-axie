import { h } from "preact";

import style from "./style.css";

const ErrorText = ({ label, hidden }) => (
  <div hidden={hidden}>
    {hidden ? <> {null}</> : <p class={style.errortext}>{label}</p>}
  </div>
);

export default ErrorText;
