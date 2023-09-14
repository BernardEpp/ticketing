import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

/// This is the 'parent' component that is automatically wrapped by next around our own components.
/// Import things like css styling here to make sure it is included in every component.
/// It is not sufficient to include it in the index.js .
const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log('rendering app component...');
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err);
    return { data: {} }; //todo: this type handling is kinda ugly and there also seem to be a next warning associated with it. Use TS?:)
  });

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
