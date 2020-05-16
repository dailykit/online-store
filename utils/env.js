import Constants from 'expo-constants';

export const BASE_URL = 'secure.dailykit.org';
export const HASURA_URL = 'https://dailykitdatahub.herokuapp.com/v1/graphql';

const ENV = {
  dev: {
    BASE_URL,
    HASURA_URL,
  },
  staging: {
    BASE_URL,
    HASURA_URL,
  },
  prod: {
    BASE_URL,
    HASURA_URL,
  },
};

function getEnvVars(env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev;
  if (env.indexOf('dev') !== -1) return ENV.dev;
  if (env.indexOf('staging') !== -1) return ENV.staging;
  if (env.indexOf('prod') !== -1) return ENV.prod;
}

export default getEnvVars(Constants.manifest.releaseChannel);
