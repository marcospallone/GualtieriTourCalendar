import { GetServerSidePropsContext } from 'next';

export function authGuard(context: GetServerSidePropsContext) {
  const { req } = context;
  const cookies = req.headers.cookie || '';

  if (!cookies.includes('auth=true')) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}