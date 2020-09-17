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
  const [version, setVersion] = useState(0);
  const [conf, setConf] = useState("");

  const stringConf = JSON.stringify(config);
  resourceCollection.onPollHandler = () => {
    console.log("poll1", version);
    setCollection(resourceCollection);
    setVersion(new Date().getTime());
  };
  useEffect(() => {
    const load = async () => {
      const newCollection = new ResourceCollection<T>(config);
      newCollection.onPollHandler = () => {
        console.log("poll2", version);
        setCollection(newCollection);
        setVersion(new Date().getTime());
      };
      await newCollection.get();
      setCollection(newCollection as ResourceCollection<T>);
      setVersion(new Date().getTime());
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
