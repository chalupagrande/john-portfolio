import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="wrapper">
      <Component {...pageProps} />
    </div>
  )
}