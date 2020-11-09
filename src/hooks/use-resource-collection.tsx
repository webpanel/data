import {
  ResourceCollection,
  ResourceCollectionConfig,
} from "../ResourceCollection";
import { useEffect, useState } from "react";

import { ResourceID } from "../Resource";

interface ResourceCollectionHookConfig<T> extends ResourceCollectionConfig<T> {
  disabled?: boolean;
}

export function useResourceCollection<T extends { id: ResourceID } = any>(
  config: ResourceCollectionHookConfig<T>
): ResourceCollection<T> {
  const [resourceCollection, setCollection] = useState<ResourceCollection<T>>(
    new ResourceCollection(config)
  );

  // @ts-ignore
  const [_, setVersion] = useState(0);
  const [conf, setConf] = useState("");

  const stringConf = JSON.stringify(config);
  resourceCollection.onPollHandler = () => {
    setCollection(resourceCollection);
    setVersion(new Date().getTime());
  };
  useEffect(() => {
    const load = async () => {
      const newCollection = new ResourceCollection<T>(config);
      newCollection.onPollHandler = () => {
        setCollection(newCollection);
        setVersion(new Date().getTime());
      };
      await newCollection.get();
      setCollection(newCollection as ResourceCollection<T>);
      setVersion(new Date().getTime());
    };
    if (conf !== stringConf && !config.disabled) {
      load();
      setConf(stringConf);
    }
  });

  useEffect(() => {
    resourceCollection.startPolling();
    return () => {
      resourceCollection.stopPolling();
    };
  }, [config.pollInterval]);

  return resourceCollection;
}
