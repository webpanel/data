import {
  ResourceCollection,
  ResourceCollectionConfig,
} from "../ResourceCollection";
import { useEffect, useState } from "react";

import { ResourceID } from "../Resource";

export function useResourceCollection<T extends { id: ResourceID } = any>(
  config: ResourceCollectionConfig<T>
): ResourceCollection<T> {
  const [resourceCollection, setCollection] = useState<ResourceCollection<T>>(
    new ResourceCollection(config)
  );
  const [conf, setConf] = useState("");

  const stringConf = JSON.stringify(config);
  resourceCollection.onPollHandler = () => {
    setCollection(resourceCollection);
  };
  useEffect(() => {
    const load = async () => {
      const newCollection = new ResourceCollection<T>(config);
      newCollection.onPollHandler = () => {
        setCollection(newCollection);
      };
      await newCollection.get();
      setCollection(newCollection as ResourceCollection<T>);
    };
    if (conf !== stringConf) {
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
