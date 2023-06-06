import { useEffect } from "react";

export default (props: any) => {
  useEffect(() => {
    console.log(props.display);
  }, []);

  return (
    <div
      style={{ background: "red", display: !props.display ? "block" : "none" }}
    >
      123
    </div>
  );
};
