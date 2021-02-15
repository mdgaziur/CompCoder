import "../styles/style.scss";

interface propsType {
  Component: React.ComponentClass;
  pageprops: any;
}

export default function App(props: propsType) {
  return <props.Component {...props.pageprops} />;
}
