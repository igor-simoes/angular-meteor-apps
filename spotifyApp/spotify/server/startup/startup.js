ServiceConfiguration.configurations.update(
    { "service": "spotify" },
    {
      $set: {
        "clientId": Meteor.settings.private.clientId,
        "secret": Meteor.settings.private.secret
      }
    },
    { upsert: true }
);
