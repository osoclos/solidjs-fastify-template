/* @refresh reload */
import { render } from "solid-js/web";

import "./style.css";
import App from "~/App.tsx";

console.log("received HTML code and running client-side code!");

const root = document.getElementById("root")!;
render(() => <App />, root);
