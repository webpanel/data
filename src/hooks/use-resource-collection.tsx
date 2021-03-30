import {
  ResourceCollection,
  ResourceCollectionConfig,
} from "../ResourceCollection";
import { useEffect, useState } from "react";

import { ResourceID } from "../Resource";

export interface ResourceCollectionHookConfig<T>
  extends ResourceCollectionConfig<T> {
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
    let mounted = true;
    const load = async () => {
      const newCollection = new ResourceCollection<T>(config);
      newCollection.onPollHandler = () => {
        setCollection(newCollection);
        setVersion(new Date().getTime());
      };
      await newCollection.get();
      if (mounted) {
        setCollection(newCollection as ResourceCollection<T>);
        setVersion(new Date().getTime());
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

  useEffect(() => {
    resourceCollection.startPolling();
    return () => {
      resourceCollection.stopPolling();
    };
  }, [config.pollInterval]);

  return resourceCollection;
}
