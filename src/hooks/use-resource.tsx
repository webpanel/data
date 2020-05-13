import { Resource, ResourceConfig } from "../Resource";
import { useEffect, useState } from "react";

export function useResource<T = any>(config: ResourceConfig<T>): Resource<T> {
  const [vaaa, setVersion] = useState(0);
  const [resource, setResource] = useState<Resource<T>>(new Resource(config));
  const [conf, setConf] = useState("");

  const updateVersion = () => {
    setVersion(vaaa + 1);
  };

  const stringConf = JSON.stringify(config);

  resource.onCreate = (id, values) => {
    updateVersion();
    if (config.onCreate) {
      config.onCreate(id, values as T);
    }
  };
  resource.onUpdate = (values) => {
    updateVersion();
    if (config.onUpdate) {
      config.onUpdate(values);
    }
  };

  useEffect(() => {
    const load = async () => {
      const newResource = new Resource(config);
      setResource(newResource as Resource<T>);
      await newResource.getIfHasID();
      updateVersion();
    };

    if (conf !== stringConf) {
      load();
      setConf(stringConf);
    }
  });

  return resource;
}
