if (process.env.NODE_ENV === 'test') {
  module.exports = {
    JWT_SECRET: 'codeworkrauthentication',
    oauth: {
      google: {
        clientID: '366510432233-cp0s337b63lkjg2g8sc2gvjas26gt3ns.apps.googleusercontent.com',
        clientSecret: 'XqdmV8Wz578OszyyPk9mU6S9',
      },
      facebook: {
        clientID: '366510432233-cp0s337b63lkjg2g8sc2gvjas26gt3ns.apps.googleusercontent.com',
        clientSecret: '535ebcfe39032f889232f880b049617c',
      },
    },
  };
} else {
  module.exports = {
    JWT_SECRET: 'something',
    oauth: {
      google: {
        clientID: '366510432233-cp0s337b63lkjg2g8sc2gvjas26gt3ns.apps.googleusercontent.com',
        clientSecret: 'XqdmV8Wz578OszyyPk9mU6S9',
      },
      facebook: {
        clientID: '1440510842722881',
        clientSecret: '535ebcfe39032f889232f880b049617c',
      },
    },
  };
}
