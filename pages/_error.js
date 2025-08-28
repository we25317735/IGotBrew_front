import * as Sentry from '@sentry/nextjs';
import NextErrorComponent from 'next/error';

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err); // 捕捉錯誤送到 Sentry
  }
  return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async (contextData) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(contextData);

  errorInitialProps.hasGetInitialPropsRun = true;

  if (contextData.err) {
    Sentry.captureException(contextData.err); // 捕捉 SSR 錯誤
  }

  return errorInitialProps;
};

export default MyError;
