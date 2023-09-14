import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('rendering currentUser');
  console.log(currentUser);
  // return (
  //   <div>
  //     <h1>Landing Page</h1>
  //     <div>You are: {currentUser}</div>
  //   </div>
  // );
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in.</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('LANDING PAGE!');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser').catch((err) => {
    console.log(`Error when requesting the current user: ${err.message}`);
    return { data: {} }; //todo: this type handling is kinda ugly and unnecessary and there also seem to be a next warning associated with it.
  });

  return data;
};

export default LandingPage;
