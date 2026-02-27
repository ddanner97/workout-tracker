import styled from "@emotion/styled";

type ContainerProps = {
  column: boolean;
};

const Container = styled("div")<ContainerProps>(({ column }) => ({
  display: "flex",
  flexDirection: column ? "column" : "row",
}));

export default Container;
