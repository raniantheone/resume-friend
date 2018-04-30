function Config() {
  return new Proxy({}, {
    get: function(target, property) {
      if(target[property] === undefined) {
        target[property] = Config();
      };
      return Reflect.get(target, property);
    }
  });
}

let config = Config();

// Ref: https://www.contentful.com/developers/docs/references/content-delivery-api/
config.contentful.space = "please replace this with yours";
config.contentful.environment = "please replace this with yours";
config.contentful.accessToken = "please replace this with yours";

export {config};
