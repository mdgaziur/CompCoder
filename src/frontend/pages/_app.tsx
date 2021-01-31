import '../styles/index.scss';

interface propsType {
    Component: JSX.Element,
    pageProps: any
}

export default function App(props: propsType) {
    return <props.Component {...props.pageProps} />
}