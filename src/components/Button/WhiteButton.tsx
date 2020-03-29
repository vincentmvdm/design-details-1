import * as Styled from "./style";

interface Props {
  children: React.ReactChildren | string;
  onClick: () => {};
}

export default function WhiteButton(props: Props) {
  const { children } = props;
  return <Styled.WhiteButton {...props}>{children}</Styled.WhiteButton>;
}
