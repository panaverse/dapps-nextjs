import type { NextComponentType, NextPageContext } from "next";

interface Props {}

const Metamask: NextComponentType<NextPageContext, {}, Props>  = (props: Props) => {
  return (
    <div
      style={{
        border: "0.5px solid #ccc",
        display: "inline-block",
        textAlign: "center",
        margin: "10px",
        padding: "20px",
        fontSize: "20px",
      }}
    >
      <p>
        {" "}
        It apprears that Metamask is not installed, <br />
        Download <a href="https://metamask.io/">Metamask</a> to continue.
      </p>
    </div>
  );
};

export default Metamask;