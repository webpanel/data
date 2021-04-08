import { Resource, ResourceConfig } from "../Resource";
import { useEffect, useState } from "react";

export interface ResourceHookConfig<T> extends ResourceConfig<T> {
  disabled?: boolean;
}

export function useResource<T = any>(
  config: ResourceHookConfig<T>
): Resource<T> {
  const [version, setVersion] = useState(0);
  const [resource, setResource] = useState<Resource<T>>(new Resource(config));
  const [conf, setConf] = useState("");

  const updateVersion = () => {
    setVersion(version + 1);
  };

  const stringConf = JSON.stringify([
    config.name,
    config.id,
    config.fields,
    config.initialArgs,
    config.pollInterval,
  ]);

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
    let mounted = true;
    const load = async () => {
      const newResource = new Resource(config);
      setResource(newResource as Resource<T>);
      await newResource.getIfHasID();
      if (mounted) {
        updateVersion();
      }
    };

    if (mounted && conf !== stringConf && !config.disabled) {
      load();
      setConf(stringConf);
    }
    return () => {
      mounted = false;
    };
  }, [stringConf]);

  return resource;
}
